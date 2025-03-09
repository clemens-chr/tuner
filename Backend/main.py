"""
Main application entry point.
"""

import logging
import asyncio
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from api.routes import router as api_router
from config.settings import get_settings
from helpers import setup_logging
from database.neo4j_client import Neo4jClient

# Setup logging
setup_logging()
logger = logging.getLogger(__name__)

# Async context manager for startup/shutdown events
@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Setup database and other resources
    settings = get_settings()
    
    # Initialize Neo4j client and set up schema
    neo4j_client = Neo4jClient(
        uri=settings.neo4j_uri,
        username=settings.neo4j_username,
        password=settings.neo4j_password
    )

    try:
        await neo4j_client.setup_schema()
        logger.info("Database schema setup complete")
    except Exception as e:
        logger.error(f"Error setting up database schema: {str(e)}")
    
    # Store clients in app state
    app.state.neo4j_client = neo4j_client
    
    logger.info("Application startup complete")
    
    yield
    
    # Shutdown: Clean up resources
    try:
        await neo4j_client.close()
        logger.info("Neo4j connection closed")
    except Exception as e:
        logger.error(f"Error closing Neo4j connection: {str(e)}")
    
    logger.info("Application shutdown complete")

# Create FastAPI application
def create_app() -> FastAPI:
    """
    Create and configure the FastAPI application.
    
    Returns:
        Configured FastAPI application
    """
    settings = get_settings()
    
    app = FastAPI(
        title=settings.app_name,
        description="Multimodal Instructor API",
        version="1.0.0",
        lifespan=lifespan
    )
    
    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    
    # Include API routes
    app.include_router(api_router, prefix=settings.api_prefix)
    
    @app.get("/")
    async def root():
        """Root endpoint for basic health check."""
        return {"message": "Welcome to the Multimodal Instructor API", "status": "online"}
    
    return app

# Create the application instance
app = create_app()

# If running directly (not imported)
if __name__ == "__main__":
    import uvicorn
    
    settings = get_settings()
    
    # Run the application with uvicorn
    uvicorn.run(
        "app:app",
        host="0.0.0.0",
        port=8000,
        reload=settings.debug,
        log_level=settings.log_level.lower()
    )