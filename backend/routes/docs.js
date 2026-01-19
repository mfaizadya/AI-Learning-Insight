'use strict';

/**
 * @fileoverview API Documentation Routes
 * @description Serves OpenAPI specification and Swagger UI for API documentation
 * @module routes/docs
 */

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const path = require('path');

const router = express.Router();

// ============================================================================
// CONFIGURATION
// ============================================================================

/**
 * Custom Swagger UI options with CerdasKu branding
 */
const SWAGGER_OPTIONS = Object.freeze({
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info .title { color: #5B4B9E; }
    .swagger-ui .opblock-tag { 
      color: #5B4B9E; 
      font-weight: 600;
      border-bottom: 1px solid #EDE8FA;
    }
    .swagger-ui .opblock.opblock-get .opblock-summary-method {
      background: #5B4B9E;
    }
    .swagger-ui .opblock.opblock-post .opblock-summary-method {
      background: #22c55e;
    }
    .swagger-ui .opblock.opblock-put .opblock-summary-method {
      background: #f59e0b;
    }
    .swagger-ui .opblock.opblock-delete .opblock-summary-method {
      background: #ef4444;
    }
    .swagger-ui .btn.execute {
      background: #5B4B9E;
      border-color: #5B4B9E;
    }
    .swagger-ui .btn.execute:hover {
      background: #4a3d82;
    }
    .swagger-ui .scheme-container {
      background: #f8f7fc;
      box-shadow: none;
    }
    .swagger-ui section.models {
      border: 1px solid #EDE8FA;
      border-radius: 8px;
    }
    .swagger-ui section.models h4 {
      color: #5B4B9E;
    }
  `,
  customSiteTitle: 'CerdasKu AI - API Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
    docExpansion: 'list',
    filter: true,
    tagsSorter: 'alpha',
    operationsSorter: 'alpha',
  },
});

// ============================================================================
// LOAD OPENAPI SPEC
// ============================================================================

// ============================================================================
// LOAD OPENAPI SPEC
// ============================================================================

const loadSwaggerSpec = () => {
  try {
    const specPath = path.join(__dirname, '../docs/openapi.yaml');
    const doc = YAML.load(specPath);
    return doc;
  } catch (error) {
    console.error('[Docs] Failed to load OpenAPI spec:', error.message);
    return {
      openapi: '3.0.3',
      info: {
        title: 'CerdasKu API',
        description: 'API documentation is currently unavailable.',
        version: '0.0.0',
      },
      paths: {},
    };
  }
};

// Initial load for Swagger UI middleware (static)
const swaggerDocument = loadSwaggerSpec();

// ============================================================================
// ROUTES
// ============================================================================

/**
 * @route GET /api/docs/openapi.json
 * @description Get OpenAPI specification as JSON (Hot-Reloaded)
 * @access Public
 */
router.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  // Reload spec on every request to support development updates
  const currentSpec = loadSwaggerSpec();
  res.json(currentSpec);
});

/**
 * @route GET /api/docs/openapi.yaml
 * @description Get OpenAPI specification as YAML
 * @access Public
 */
router.get('/openapi.yaml', (req, res) => {
  const specPath = path.join(__dirname, '../docs/openapi.yaml');
  res.setHeader('Content-Type', 'text/yaml');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.sendFile(specPath);
});

/**
 * @route GET /api/docs
 * @description Swagger UI documentation interface
 * @access Public
 */
router.use('/', swaggerUi.serve);
router.get('/', swaggerUi.setup(swaggerDocument, SWAGGER_OPTIONS));

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = router;
