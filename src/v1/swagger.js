// In src/v1/swagger.js
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const PORT = process.env.PORT || 3001

// Basic Meta Informations about our API
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Newspaper Master API",
      version: "1.0.0",
      description:
        "API application para conectar noticias",
      license: {
        name: "MIT",
        url: "https://spdx.org/licenses/MIT.html",
      },
      contact: {
        name: "eliasmmata",
        url: "https://eliasmmataportfolio.netlify.app/",
        email: "philjacksoncompany@gmail.com",
      },
    },
    servers: [
      {
        url: process.env.PORT ? `https://back-news-api-master.up.railway.app` : 'http://localhost:3001',
      },
    ],
  },
  apis: [
    "./src/v1/routes/PostsRoutes.js",
    "./src/v1/routes/MediaRoutes.js",
    "./src/v1/routes/NewsRoutes.js",
  ],
  components: {
    schemas: {
      Posts: {
        type: "object",
        properties: {
          found: {
            type: "integer",
            description: "Number of posts",
            example: 100
          },
          posts: {
            type: "array",
            description: "Array with all posts",
            example: []
          },
          wpcom: {
            type: "boolean",
            description: "Site is WP or not",
            example: true
          },
        },
      },
      SinglePost: {
        type: 'object',
        properties: {
          id: {
            type: 'integer',
            description: 'The ID of the post',
            example: 1
          },
          title: {
            type: 'string',
            description: 'The title of the post',
            example: 'Sample Post Title'
          },
          featured_media: {
            type: 'integer',
            description: 'The ID of the featured media',
            example: 123
          },
          content: {
            type: 'object',
            description: 'The content of the post',
            example: { body: 'This is the content of the post' }
          },
          date: {
            type: 'string',
            description: 'The date of the post',
            example: '2023-11-08'
          },
          date_gmt: {
            type: 'string',
            description: 'The GMT date of the post',
            example: '2023-11-08'
          },
          guid: {
            type: 'object',
            description: 'The GUID of the post',
            example: { url: 'https://example.com/post/1' }
          },
          modified: {
            type: 'string',
            description: 'The modified date of the post',
            example: '2023-11-08'
          },
          modified_gmt: {
            type: 'string',
            description: 'The GMT modified date of the post',
            example: '2023-11-08'
          },
          slug: {
            type: 'string',
            description: 'The post slug',
            example: 'sample-post-slug'
          },
          status: {
            type: 'string',
            description: 'The post status',
            example: 'publish'
          },
          type: {
            type: 'string',
            description: 'The post type',
            example: 'post'
          },
          link: {
            type: 'string',
            description: 'The post link',
            example: 'https://example.com/post/1'
          },
          excerpt: {
            type: 'object',
            description: 'The excerpt of the post',
            example: { brief: 'A short excerpt' }
          },
          author: {
            type: 'integer',
            description: 'The author of the post',
            example: 1
          },
          comment_status: {
            type: 'string',
            description: 'The comment status',
            example: 'open'
          },
          ping_status: {
            type: 'string',
            description: 'The ping status',
            example: 'closed'
          },
          sticky: {
            type: 'boolean',
            description: 'Indicates if the post is sticky',
            example: false
          },
          template: {
            type: 'string',
            description: 'The post template',
            example: 'default'
          },
          format: {
            type: 'string',
            description: 'The post format',
            example: 'standard'
          },
          meta: {
            type: 'object',
            description: 'The meta information of the post',
            example: { key1: 'value1', key2: 'value2' }
          },
          categories: {
            type: 'array',
            description: 'The post categories',
            example: ['Category 1', 'Category 2']
          },
          tags: {
            type: 'array',
            description: 'The post tags',
            example: ['Tag 1', 'Tag 2']
          },
          acf: {
            type: 'array',
            description: 'The post Advanced Custom Fields',
            example: [{ field1: 'value1' }, { field2: 'value2' }]
          },
          yoast_head_json: {
            type: 'object',
            description: 'The Yoast SEO JSON data',
            example: { title: 'Sample Title', description: 'Sample Description' }
          },
          _links: {
            type: 'object',
            description: 'Links related to the post',
            example: { self: 'https://example.com/post/1' }
          },
        }
      },
      Media: {
        type: "object",
        properties: {
          featured_media: {
            type: "integer",
            description: "The ID of the media attached",
          }
        }
      }
    },
  }
}

// Docs in JSON format
const swaggerSpec = swaggerJSDoc(options);


// Function to setup our docs
export const swaggerDocs = (app, port) => {
  // Route-Handler to visit our docs
  app.use("/api/v1/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Make our docs in JSON format available
  app.get("/api/v1/docs.json", (req, res) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerSpec);
  });
  if (PORT !== 3001) {
    console.log('URL SWAGGER PROD: ', options.definition.servers[0].url);
    console.log(process.env.PORT);
    console.log(`🗒 Version 1 Docs are available on https://back-news-api-master.up.railway.app/api/v1/docs`);
  } else {
    console.log('URL SWAGGER DEV: ', options.definition.servers[0].url);
    console.log('🗒 Version 1 Docs are available on http://localhost:3001/api/v1/docs');
    console.log(process.env.PORT);

  }
};
