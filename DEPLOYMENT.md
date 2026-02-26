# HEALX - DEPLOYMENT GUIDE

## Production Deployment

### 1. Environment Setup

```bash
# Backend .env
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/healx
JWT_SECRET=your_very_secure_secret_key_min_32_chars
PORT=5000
AI_SERVICE_URL=https://ai.yourdomain.com
CLIENT_URL=https://yourdomain.com
```

### 2. Docker Deployment

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d

# View logs
docker-compose logs -f

# Stop containers
docker-compose down
```

### 3. Kubernetes Deployment

```bash
# Create namespace
kubectl create namespace healx

# Apply manifests
kubectl apply -f k8s/mongodb.yaml -n healx
kubectl apply -f k8s/backend.yaml -n healx
kubectl apply -f k8s/frontend.yaml -n healx
kubectl apply -f k8s/ai-service.yaml -n healx

# Check status
kubectl get pods -n healx
```

### 4. Cloud Deployment (AWS)

#### Option A: EC2

```bash
# SSH to instance
ssh -i key.pem ubuntu@instance_ip

# Install dependencies
sudo apt update && sudo apt install -y nodejs npm python3 mongodb

# Clone and setup
git clone <repo>
cd psb6-health-platform
./setup.sh

# Run with PM2
npm install -g pm2
pm2 start server/server.js
pm2 startup
pm2 save
```

#### Option B: ECS

1. Push Docker images to ECR
2. Create task definitions
3. Create ECS service
4. Configure load balancer

#### Option C: Elastic Beanstalk

```bash
eb init -p node.js-18 healx-health
eb create healx-env
eb deploy
```

### 5. Database Optimization

```javascript
// Enable MongoDB Atlas backup
// Create indexes for performance
db.emergencies.createIndex({ createdAt: -1, severity: 1 })
db.emergencies.createIndex({ location: "2dsphere" })

// Setup sharding for scale
sh.enableSharding("healx")
sh.shardCollection("healx.emergencies", { _id: "hashed" })
```

### 6. Monitoring & Alerts

```yaml
# Prometheus config (prometheus.yml)
global:
  scrape_interval: 15s

scrape_configs:
  - job_name: 'healx-backend'
    static_configs:
      - targets: ['localhost:5000']

  - job_name: 'healx-ai-service'
    static_configs:
      - targets: ['localhost:8000']
```

### 7. SSL/TLS Setup

```bash
# Using Let's Encrypt with Certbot
sudo certbot certonly --standalone -d yourdomain.com
sudo certbot certonly --standalone -d api.yourdomain.com

# Configure Nginx
sudo apt install nginx
sudo nano /etc/nginx/sites-available/healx

# Restart Nginx
sudo systemctl restart nginx
```

### 8. CI/CD Pipeline (GitHub Actions)

```yaml
name: Deploy HEALX

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build and push Docker images
        run: |
          docker build -t healx-backend:latest server/
          docker build -t healx-frontend:latest client/
          docker build -t healx-ai:latest ai-service/
          
      - name: Deploy to production
        run: docker-compose -f docker-compose.prod.yml up -d
```

### 9. Backup Strategy

```bash
# Daily MongoDB backup
0 2 * * * mongodump --uri mongodb+srv://... --out /backups/healx-$(date +\%Y\%m\%d)

# Database replication
# Setup replica set for high availability
```

### 10. Performance Tuning

```javascript
// Redis caching
const redis = require('redis');
const client = redis.createClient({ host: 'localhost', port: 6379 });

// Cache emergency stats
const cacheKey = 'emergencies:stats';
client.setex(cacheKey, 300, JSON.stringify(stats));

// MongoDB aggregation optimization
db.emergencies.aggregate([
  { $match: { createdAt: { $gte: new Date() } } },
  { $group: { _id: null, count: { $sum: 1 } } }
])
```

### 11. Security Checklist

- [ ] Enable HTTPS/TLS everywhere
- [ ] Rate limiting enabled
- [ ] JWT token expiration set
- [ ] CORS properly configured
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (MongoDB injection)
- [ ] XSS protection headers
- [ ] CSRF tokens for state-changing operations
- [ ] Secrets in environment variables
- [ ] Regular security audits
- [ ] DDoS protection enabled
- [ ] WAF rules configured

### 12. Scaling Strategy

```bash
# Horizontal scaling
# 1. Load balancer (Nginx/HAProxy)
# 2. Multiple backend instances
# 3. Database replication
# 4. Redis cache layer
# 5. CDN for frontend

# Vertical scaling
# Increase server resources as needed
# Netflix Eureka for service discovery
# Service mesh (Istio) for microservices
```

### 13. Disaster Recovery

1. **Daily Backups**: Automated MongoDB+ S3
2. **Replication**: Multi-region setup
3. **Failover**: Automatic with RTO < 5 min
4. **Test Recovery**: Monthly drills
5. **Documentation**: Runbook updated

### Support & Monitoring

- Datadog/New Relic for APM
- PagerDuty for alerts
- LogStash for centralized logging
- Grafana dashboards for visualization
