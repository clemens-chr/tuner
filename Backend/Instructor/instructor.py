"""
The main instructor module responsible for processing user requests and determining
whether to direct users to the marketplace or the data recording application.
"""

import logging
from typing import Dict, List, Optional, Union, Any

import sys
import os

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from task_classifier import TaskClassifier
from multimodal.processor import MultimodalProcessor
from ..database.neo4j_client import Neo4jClient
from ..api.groq_client import GroqClient

logger = logging.getLogger(__name__)

class Instructor:
    """
    The Instructor class handles multimodal inputs from users, classifies tasks,
    and determines whether to direct users to the marketplace or data recording application.
    """
    
    def __init__(self, config: Dict[str, Any]):
        """
        Initialize the Instructor with necessary components.
        
        Args:
            config: Configuration dictionary containing necessary settings
        """
        self.config = config
        self.task_classifier = TaskClassifier()
        self.multimodal_processor = MultimodalProcessor()
        self.neo4j_client = Neo4jClient(
            uri=config["neo4j"]["uri"],
            username=config["neo4j"]["username"],
            password=config["neo4j"]["password"]
        )
        self.groq_client = GroqClient(api_key=config["groq"]["api_key"])
        
    async def process_request(self, 
                        text: Optional[str] = None, 
                        images: Optional[List[bytes]] = None,
                        video: Optional[bytes] = None) -> Dict[str, Any]:
        """
        Process a user request containing multimodal data.
        
        Args:
            text: Optional text input from the user
            images: Optional list of image data
            video: Optional video data
            
        Returns:
            A dictionary containing the response to the user, including
            whether to redirect to marketplace or data recording app
        """
        # Process multimodal inputs
        processed_data = await self.multimodal_processor.process(text, images, video)
        
        # Get embedding from Groq API
        embedding = await self.groq_client.get_embedding(processed_data["combined_representation"])
        
        # Check if similar task exists in marketplace
        similar_tasks = await self.neo4j_client.find_similar_tasks(embedding)
        
        # Classify the task
        task_type = self.task_classifier.classify(processed_data, similar_tasks)
        
        # Determine where to direct the user
        if similar_tasks and task_type["marketplace_confidence"] > 0.8:
            # High confidence match in marketplace
            return {
                "redirect_to": "marketplace",
                "task_id": similar_tasks[0]["id"],
                "confidence": task_type["marketplace_confidence"],
                "message": "We found a matching application in our marketplace that can help with your task!"
            }
        else:
            # No good match, direct to data recording
            return {
                "redirect_to": "record_new_data",
                "processed_data": processed_data,
                "message": "Let's create a new task with your data to help you better."
            }
    
    async def save_new_task(self, task_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Save a new task to the database after recording new data.
        
        Args:
            task_data: Data about the new task
            
        Returns:
            Information about the saved task
        """
        # Generate embedding for the task
        embedding = await self.groq_client.get_embedding(task_data["description"])
        
        # Save to Neo4j
        task_id = await self.neo4j_client.create_task(
            title=task_data["title"],
            description=task_data["description"],
            embedding=embedding,
            metadata=task_data["metadata"]
        )
        
        return {
            "task_id": task_id,
            "status": "created",
            "message": "Your task has been created successfully."
        }