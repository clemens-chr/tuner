"""
Groq API client for multimodal processing.
"""

from typing import Dict, List, Any, Optional
import logging
import aiohttp
import json
import base64

logger = logging.getLogger(__name__)

class GroqClient:
    """
    Client for interacting with Groq's multimodal API.
    Handles processing of text, images, and video.
    """
    
    def __init__(self, api_key: str):
        """
        Initialize Groq API client.
        
        Args:
            api_key: API key for Groq
        """
        self.api_key = api_key
        self.base_url = "https://api.groq.com/v1"
        self.headers = {
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json"
        }
        
    async def get_embedding(self, text: str) -> List[float]:
        """
        Get vector embedding for text.
        
        Args:
            text: Text to generate embedding for
            
        Returns:
            Vector embedding as list of floats
        """
        endpoint = f"{self.base_url}/embeddings"
        
        payload = {
            "model": "embedding-001",
            "input": text,
            "dimensions": 1536  # Standard embedding size
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, headers=self.headers, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Groq API error: {error_text}")
                    raise Exception(f"Groq API error: {response.status}")
                    
                data = await response.json()
                return data.get("data", [{}])[0].get("embedding", [])
                
    async def process_text(self, text: str) -> Dict[str, Any]:
        """
        Process text using Groq API.
        
        Args:
            text: Text to process
            
        Returns:
            Dictionary with processed text information
        """
        endpoint = f"{self.base_url}/chat/completions"
        
        payload = {
            "model": "mixtral-8x7b-32768",  # Or other appropriate model
            "messages": [
                {"role": "system", "content": "Analyze the following text and provide a summary, key entities, and topics."},
                {"role": "user", "content": text}
            ],
            "temperature": 0.1
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, headers=self.headers, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Groq API error: {error_text}")
                    raise Exception(f"Groq API error: {response.status}")
                    
                data = await response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                try:
                    # Parse the structured response (assuming model returns JSON-like format)
                    result = json.loads(content)
                except Exception:
                    # If not JSON, use the raw text
                    result = {"summary": content}
                    
                return result
                
    async def process_image(self, image_data: str) -> Dict[str, Any]:
        """
        Process image using Groq API.
        
        Args:
            image_data: Base64 encoded image data
            
        Returns:
            Dictionary with image analysis results
        """
        endpoint = f"{self.base_url}/chat/completions"
        
        # Construct the prompt with image
        payload = {
            "model": "llava-13b-v1.6",  # Use a multimodal model that supports images
            "messages": [
                {"role": "system", "content": "Describe this image in detail. Identify objects, scenes, and any text visible."},
                {
                    "role": "user", 
                    "content": [
                        {"type": "text", "text": "What's in this image?"},
                        {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_data}"}}
                    ]
                }
            ],
            "temperature": 0.1
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, headers=self.headers, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Groq API error: {error_text}")
                    raise Exception(f"Groq API error: {response.status}")
                    
                data = await response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                # Extract information from the model's response
                return {
                    "description": content,
                    "objects": self._extract_objects_from_description(content)
                }
    
    async def process_video(self, video_path: str, key_frames: List[bytes]) -> Dict[str, Any]:
        """
        Process video using key frames and Groq API.
        
        Args:
            video_path: Path to video file
            key_frames: List of key frame data in bytes
            
        Returns:
            Dictionary with video analysis results
        """
        # Process key frames individually
        frame_descriptions = []
        for i, frame_data in enumerate(key_frames):
            # Convert frame to base64
            base64_frame = base64.b64encode(frame_data).decode('utf-8')
            
            # Process each frame
            frame_result = await self.process_image(base64_frame)
            frame_descriptions.append(frame_result)
            
        # Combine frame descriptions to create video summary
        combined_text = "\n".join([f"Frame {i+1}: {desc['description']}" 
                                for i, desc in enumerate(frame_descriptions)])
        
        # Get overall summary of the video
        endpoint = f"{self.base_url}/chat/completions"
        
        payload = {
            "model": "mixtral-8x7b-32768",  # Or appropriate model
            "messages": [
                {"role": "system", "content": "Create a concise summary of this video based on the descriptions of key frames."},
                {"role": "user", "content": combined_text}
            ],
            "temperature": 0.1
        }
        
        async with aiohttp.ClientSession() as session:
            async with session.post(endpoint, headers=self.headers, json=payload) as response:
                if response.status != 200:
                    error_text = await response.text()
                    logger.error(f"Groq API error: {error_text}")
                    raise Exception(f"Groq API error: {response.status}")
                    
                data = await response.json()
                content = data.get("choices", [{}])[0].get("message", {}).get("content", "")
                
                return {
                    "summary": content,
                    "frame_descriptions": frame_descriptions,
                    "description": self._extract_main_description(content)
                }
    
    def _extract_objects_from_description(self, description: str) -> str:
        """
        Extract object names from a description.
        
        Args:
            description: Image description
            
        Returns:
            Comma-separated list of objects
        """
        # This is a simplified placeholder implementation
        # In a real system, you might use NLP to extract entities
        words = description.split()
        # Simple object extraction - just get nouns (assumption)
        objects = [word.strip(',.!?():;') for word in words if len(word) > 4]
        # Remove duplicates and join
        unique_objects = list(set(objects))[:10]  # Limit to 10 objects
        return ", ".join(unique_objects)
    
    def _extract_main_description(self, summary: str) -> str:
        """
        Extract main description from a summary.
        
        Args:
            summary: Video summary
            
        Returns:
            Main description
        """
        # Simple implementation - just take the first sentence
        sentences = summary.split('.')
        if sentences:
            return sentences[0] + '.'
        return summary