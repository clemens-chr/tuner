"""
API routes for the multimodal instructor backend.
"""

from typing import Dict, Any, List, Optional
import logging
from fastapi import APIRouter, File, Form, UploadFile, HTTPException, Depends, Body
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from ..instructor.instructor import Instructor
from ..config.settings import get_settings

logger = logging.getLogger(__name__)

# Pydantic models for request/response validation
class TaskResponse(BaseModel):
    redirect_to: str
    message: str
    task_id: Optional[str] = None
    confidence: Optional[float] = None
    processed_data: Optional[Dict[str, Any]] = None

class NewTaskRequest(BaseModel):
    title: str
    description: str
    metadata: Dict[str, Any]

# Create router
router = APIRouter(prefix="/api/v1")

# Dependency to get the instructor
async def get_instructor():
    settings = get_settings()
    instructor = Instructor(settings.dict())
    try:
        yield instructor
    finally:
        # Any cleanup if needed
        pass

@router.post("/process", response_model=TaskResponse)
async def process_request(
    text: Optional[str] = Form(None),
    images: Optional[List[UploadFile]] = File(None),
    video: Optional[UploadFile] = File(None),
    instructor: Instructor = Depends(get_instructor)
):
    """
    Process a multimodal request and determine where to direct the user.
    """
    try:
        # Process uploaded images if any
        image_data = []
        if images:
            for img in images:
                content = await img.read()
                image_data.append(content)
                
        # Process uploaded video if any
        video_data = None
        if video:
            video_data = await video.read()
             
        # Process the request with the instructor
        result = await instructor.process_request(
            text=text, 
            images=image_data if image_data else None,
            video=video_data
        )
        
        return result
        
    except Exception as e:
        logger.error(f"Error processing request: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")

@router.post("/tasks", response_model=Dict[str, Any])
async def create_task(
    task_data: NewTaskRequest,
    instructor: Instructor = Depends(get_instructor)
):
    """
    Create a new task after recording data.
    """
    try:
        result = await instructor.save_new_task(task_data.dict())
        return result
    except Exception as e:
        logger.error(f"Error creating task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error creating task: {str(e)}")

@router.get("/marketplace/{task_id}", response_model=Dict[str, Any])
async def get_marketplace_task(
    task_id: str,
    instructor: Instructor = Depends(get_instructor)
):
    """
    Get details about a marketplace task.
    """
    try:
        task = await instructor.neo4j_client.get_task_by_id(task_id)
        if not task:
            raise HTTPException(status_code=404, detail=f"Task with ID {task_id} not found")
        return task
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error retrieving task: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Error retrieving task: {str(e)}")

@router.get("/health")
async def health_check():
    """
    Health check endpoint.
    """
    return {"status": "ok", "service": "multimodal-instructor"}