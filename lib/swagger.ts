export const swaggerSpec = {
  openapi: '3.0.0',
  info: {
    title: 'ALVB Quotes API',
    version: '1.0.0',
    description: '개인정보를 제외한 견적 사례 조회 및 견적 신청 API',
  },
  servers: [
    {
      url: '/api',
      description: 'API Server',
    },
  ],
  paths: {
    '/quotes': {
      get: {
        summary: '모든 견적 목록 조회',
        tags: ['Quotes'],
        responses: {
          200: {
            description: '성공',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/PublicQuote' },
                },
              },
            },
          },
        },
      },
      post: {
        summary: '새 견적 생성',
        tags: ['Quotes'],
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/QuoteCreate' },
            },
          },
        },
        responses: {
          201: {
            description: '생성됨',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    message: { type: 'string', example: 'Quote created successfully' },
                  },
                },
              },
            },
          },
        },
      },
    },
    '/quotes/{id}': {
      get: {
        summary: '특정 견적 조회',
        tags: ['Quotes'],
        parameters: [
          {
            name: 'id',
            in: 'path',
            required: true,
            schema: { type: 'string' },
          },
        ],
        responses: {
          200: {
            description: '성공',
            content: {
              'application/json': {
                schema: { $ref: '#/components/schemas/PublicQuote' },
              },
            },
          },
          404: { description: '견적을 찾을 수 없음' },
        },
      },
    },
  },
  components: {
    schemas: {
      PublicQuote: {
        type: 'object',
        properties: {
          id: { type: 'string', format: 'uuid' },
          business_type: { type: 'string', example: '카페' },
          project_type: { type: 'string', example: '풀인테리어' },
          area: { type: 'string', example: '30평' },
          budget: { type: 'string', example: '5000만원' },
          location: { type: 'string', example: '서울 강남구' },
          created_at: { type: 'string', format: 'date-time' },
          updated_at: { type: 'string', format: 'date-time' },
        },
      },
      QuoteCreate: {
        type: 'object',
        required: ['name', 'business_type', 'project_type', 'area', 'location'],
        properties: {
          name: { type: 'string', example: '홍길동' },
          phone: { type: 'string', example: '010-1234-5678' },
          email: { type: 'string', format: 'email', example: 'hong@example.com' },
          business_type: { type: 'string', example: '카페' },
          project_type: { type: 'string', example: '풀인테리어' },
          area: { type: 'string', example: '30평' },
          budget: { type: 'string', example: '5000만원' },
          location: { type: 'string', example: '서울 강남구' },
          preferred_date: { type: 'string', format: 'date', example: '2024-02-01' },
          preferred_time: { type: 'string', example: '오후 2-4시' },
          message: { type: 'string', example: '인테리어 견적 문의드립니다' },
        },
      },
    },
  },
}
