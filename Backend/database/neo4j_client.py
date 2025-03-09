"""
Neo4j client for vector database operations.
"""

from typing import Dict, List, Any, Optional
import logging
import uuid
from neo4j import GraphDatabase, AsyncGraphDatabase

logger = logging.getLogger(__name__)

class Neo4jClient:
    """
    Client for interacting with Neo4j vector database.
    Handles vector similarity searches and CRUD operations for tasks.
    """
    
    def __init__(self, uri: str, username: str, password: str):
        """
        Initialize Neo4j client.
        
        Args:
            uri: Neo4j database URI
            username: Neo4j username
            password: Neo4j password
        """
        self.uri = uri
        self.username = username
        self.password = password
        self.driver = AsyncGraphDatabase.driver(uri, auth=(username, password))
        
    async def close(self):
        """Close the Neo4j connection."""
        await self.driver.close()
        
    async def create_task(self, title: str, description: str, 
                     embedding: List[float], metadata: Dict[str, Any]) -> str:
        """
        Create a new task in the database.
        
        Args:
            title: Task title
            description: Task description
            embedding: Vector embedding of the task
            metadata: Additional metadata about the task
            
        Returns:
            ID of the created task
        """
        task_id = str(uuid.uuid4())
        
        async with self.driver.session() as session:
            # Create task node with vector embedding
            query = """
            CREATE (t:Task {
                id: $id,
                title: $title,
                description: $description,
                embedding: $embedding,
                created_at: datetime(),
                metadata: $metadata
            })
            RETURN t.id as id
            """
            
            result = await session.run(
                query,
                id=task_id,
                title=title,
                description=description,
                embedding=embedding,
                metadata=metadata
            )
            
            record = await result.single()
            return record["id"]
            
    async def find_similar_tasks(self, embedding: List[float], 
                           limit: int = 5, threshold: float = 0.7) -> List[Dict[str, Any]]:
        """
        Find similar tasks using vector similarity search.
        
        Args:
            embedding: Vector embedding to search with
            limit: Maximum number of results to return
            threshold: Minimum similarity threshold
            
        Returns:
            List of similar tasks with similarity scores
        """
        async with self.driver.session() as session:
            # Use vector similarity search
            # Note: This assumes Neo4j with vector index capabilities is set up
            query = """
            MATCH (t:Task)
            WHERE EXISTS(t.embedding)
            WITH t, gds.similarity.cosine(t.embedding, $embedding) AS similarity
            WHERE similarity >= $threshold
            RETURN t.id AS id, t.title AS title, t.description AS description, 
                   similarity, t.metadata AS metadata
            ORDER BY similarity DESC
            LIMIT $limit
            """
            
            result = await session.run(
                query,
                embedding=embedding,
                threshold=threshold,
                limit=limit
            )
            
            tasks = [dict(record) async for record in result]
            return tasks
            
    async def get_task_by_id(self, task_id: str) -> Optional[Dict[str, Any]]:
        """
        Get a task by its ID.
        
        Args:
            task_id: ID of the task to retrieve
            
        Returns:
            Task data or None if not found
        """
        async with self.driver.session() as session:
            query = """
            MATCH (t:Task {id: $id})
            RETURN t.id AS id, t.title AS title, t.description AS description,
                   t.metadata AS metadata, t.created_at AS created_at
            """
            
            result = await session.run(query, id=task_id)
            record = await result.single()
            
            if not record:
                return None
                
            return dict(record)
            
    async def update_task(self, task_id: str, updates: Dict[str, Any]) -> bool:
        """
        Update a task.
        
        Args:
            task_id: ID of the task to update
            updates: Dictionary of fields to update
            
        Returns:
            True if update was successful, False otherwise
        """
        async with self.driver.session() as session:
            # Build dynamic update query based on provided fields
            set_clauses = []
            params = {"id": task_id}
            
            for key, value in updates.items():
                if key not in ["id", "created_at"]:  # Don't allow updating these fields
                    set_clauses.append(f"t.{key} = ${key}")
                    params[key] = value
                    
            if not set_clauses:
                return False
                
            query = f"""
            MATCH (t:Task {{id: $id}})
            SET {', '.join(set_clauses)}, t.updated_at = datetime()
            RETURN t.id as id
            """
            
            result = await session.run(query, **params)
            record = await result.single()
            
            return record is not None
            
    async def delete_task(self, task_id: str) -> bool:
        """
        Delete a task.
        
        Args:
            task_id: ID of the task to delete
            
        Returns:
            True if deletion was successful, False otherwise
        """
        async with self.driver.session() as session:
            query = """
            MATCH (t:Task {id: $id})
            DELETE t
            RETURN count(*) as deleted
            """
            
            result = await session.run(query, id=task_id)
            record = await result.single()
            
            return record and record["deleted"] > 0
            
    async def setup_schema(self):
        """Set up database schema including indices and constraints."""
        async with self.driver.session() as session:
            # Create constraint on Task.id
            await session.run("CREATE CONSTRAINT task_id IF NOT EXISTS FOR (t:Task) REQUIRE t.id IS UNIQUE")
            
            # Create vector index for embeddings (assumes Neo4j Enterprise with vector index capabilities)
            # Note: This is specific to Neo4j 5.0+ with vector capabilities
            try:
                await session.run("""
                CALL db.index.vector.createNodeIndex(
                    'task_embedding_index',
                    'Task',
                    'embedding',
                    1536,
                    'cosine'
                )
                """)
            except Exception as e:
                logger.warning(f"Could not create vector index: {str(e)}")