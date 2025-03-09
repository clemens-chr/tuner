"""
Database schema definitions for Neo4j database.
"""

from typing import Dict, Any
import logging

logger = logging.getLogger(__name__)

class Schema:
    """Defines and manages the Neo4j database schema."""
    
    # Definition of node labels
    LABELS = {
        "Task": {
            "description": "Represents a user task with multimodal content",
            "properties": {
                "id": "Unique identifier (UUID)",
                "title": "Task title",
                "description": "Task description",
                "embedding": "Vector embedding (List of floats)",
                "created_at": "Creation timestamp",
                "updated_at": "Last update timestamp",
                "metadata": "JSON object with additional properties"
            }
        },
        "User ": {
            "description": "Represents a system user",
            "properties": {
                "id": "Unique identifier (UUID)",
                "username": "User 's username",
                "email": "User 's email address",
                "created_at": "Creation timestamp",
                "updated_at": "Last update timestamp",
                "metadata": "JSON object with additional properties"
            }
        },
        "Project": {
            "description": "Represents a project that contains tasks",
            "properties": {
                "id": "Unique identifier (UUID)",
                "name": "Project name",
                "description": "Project description",
                "created_at": "Creation timestamp",
                "updated_at": "Last update timestamp",
                "metadata": "JSON object with additional properties"
            }
        },
        "Comment": {
            "description": "Represents a comment on a task",
            "properties": {
                "id": "Unique identifier (UUID)",
                "content": "Comment content",
                "created_at": "Creation timestamp",
                "updated_at": "Last update timestamp",
                "metadata": "JSON object with additional properties"
            }
        }
    }

    # Definition of relationships
    RELATIONSHIPS = {
        "ASSIGNED_TO": {
            "description": "Relationship indicating a user is assigned to a task",
            "properties": {
                "assigned_at": "Timestamp when the user was assigned to the task"
            }
        },
        "BELONGS_TO": {
            "description": "Relationship indicating a task belongs to a project",
            "properties": {
                "created_at": "Timestamp when the task was added to the project"
            }
        },
        "HAS_COMMENT": {
            "description": "Relationship indicating a task has comments",
            "properties": {
                "created_at": "Timestamp when the comment was made"
            }
        }
    }

    @classmethod
    def get_labels(cls) -> Dict[str, Any]:
        """Returns the defined node labels."""
        return cls.LABELS

    @classmethod
    def get_relationships(cls) -> Dict[str, Any]:
        """Returns the defined relationships."""
        return cls.RELATIONSHIPS

    @classmethod
    def log_schema(cls):
        """Logs the schema definitions for debugging purposes."""
        logger.info("Neo4j Database Schema:")
        logger.info("Node Labels:")
        for label, details in cls.LABELS.items():
            logger.info(f"  {label}: {details['description']}")
            for prop, desc in details['properties'].items():
                logger.info(f"    - {prop}: {desc}")
        logger.info("Relationships:")
        for rel, details in cls.RELATIONSHIPS.items():
            logger.info(f"  {rel}: {details['description']}")
            for prop, desc in details['properties'].items():
                logger.info(f"    - {prop}: {desc}")
