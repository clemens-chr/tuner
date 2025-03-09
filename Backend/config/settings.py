"""
Configuration settings for the application.
"""

from typing import Dict, Any, Optional
from pydantic import BaseSettings, Field, validator
import os
import json

class Settings(BaseSettings):
    """
    Application settings loaded from environment variables.
    """
    # Neo4j settings
    neo4j_uri: str = Field(..., env="NEO4J_URI")
    neo4j_username: str = Field(..., env="neo4j")
    neo4j_password: str = Field(..., env="ZeSTs4Nit_8fS3bSgm49BRUWTXY1L9QMaDKKCPRhI9g")
    
    # Groq API settings
    groq_api_key: str = Field(..., env="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")
    
    # Application settings
    app_name: str = Field("Multimodal Instructor", env="APP_NAME")
    debug: bool = Field(False, env="DEBUG")
    log_level: str = Field("INFO", env="LOG_LEVEL")
    
    # File upload settings
    max_upload_size_mb: int = Field(50, env="MAX_UPLOAD_SIZE_MB")
    allowed_image_types: str = Field("image/jpeg,image/png,image/gif", env="ALLOWED_IMAGE_TYPES")
    allowed_video_types: str = Field("video/mp4,video/mpeg,video/quicktime", env="ALLOWED_VIDEO_TYPES")
    
    # API settings
    api_prefix: str = Field("/api/v1", env="API_PREFIX")
    cors_origins: str = Field("*", env="CORS_ORIGINS")
    
    @validator("cors_origins")
    def parse_cors_origins(cls, v):
        """Parse CORS origins as a list."""
        return v.split(",")
    
    def dict(self) -> Dict[str, Any]:
        """Convert settings to a dictionary format for the application."""
        settings_dict = super().dict()
        
        # Format for use in the application
        return {
            "neo4j": {
                "uri": self.neo4j_uri,
                "username": self.neo4j_username,
                "password": self.neo4j_password
            },
            "groq": {
                "api_key": self.groq_api_key
            },
            "app": {
                "name": self.app_name,
                "debug": self.debug,
                "log_level": self.log_level,
                "max_upload_size_mb": self.max_upload_size_mb,
                "allowed_image_types": self.allowed_image_types.split(","),
                "allowed_video_types": self.allowed_video_types.split(","),
                "api_prefix": self.api_prefix,
                "cors_origins": self.cors_origins if isinstance(self.cors_origins, list) else self.cors_origins.split(",")
            }
        }
        
    class Config:
        """Pydantic config."""
        env_file = ".env"
        env_file_encoding = "utf-8"
        

def get_settings() -> Settings:
    """
    Get application settings.
    
    Returns:
        Settings object
    """
    return Settings()