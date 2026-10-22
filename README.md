# Expense Tracker — DevOps Learning Project

Flow: **GitHub → Jenkins → Build + Test → Docker → Docker Hub → Kubernetes → Browser**

## App features
- Add expenses (title, amount, category)
- List and delete expenses
- Calculate total expenses
- Health endpoint `/api/health`

Demo limitation: expenses are stored in memory and reset when the application restarts. Do not use this for real financial data.

## Requirements
Git, Node.js 20+ (Node 22 recommended), Docker Desktop, Docker Hub account, `kubectl` and Minikube for local Kubernetes. The Jenkins agent needs Git, Node/npm, Docker CLI/daemon, and kubectl access to the target cluster.

## 1. Run locally
```bash
npm install
npm test
npm start
```
Open http://localhost:3000

## 2. Push to GitHub
Create an empty GitHub repository, then run in this folder:
```bash
git init
git add .
git commit -m "Initial Expense Tracker application"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/expense-tracker-devops.git
git push -u origin main
```
Replace the remote URL with your repository URL.

## 3. Build and run Docker
```bash
docker build -t YOUR_DOCKERHUB_USERNAME/expense-tracker:latest .
docker run --rm -p 3000:3000 YOUR_DOCKERHUB_USERNAME/expense-tracker:latest
```
Open http://localhost:3000

## 4. Push to Docker Hub manually for the first test
Create a Docker Hub repository named `expense-tracker`, then:
```bash
docker login
docker push YOUR_DOCKERHUB_USERNAME/expense-tracker:latest
```
Never commit passwords or tokens to GitHub.

## 5. Kubernetes with Minikube
```bash
minikube start
kubectl get nodes
```
Replace `YOUR_DOCKERHUB_USERNAME` in `k8s/deployment.yaml`, then:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl get deployments
kubectl get pods
kubectl get services
minikube service expense-tracker
```
Check logs and rollout:
```bash
kubectl rollout status deployment/expense-tracker
kubectl logs deployment/expense-tracker
```

## 6. Configure Jenkins
### Docker Hub credentials
In Jenkins: **Manage Jenkins → Credentials → (global) → Add Credentials**:
- Kind: Username with password
- Username: Docker Hub username
- Password: Docker Hub access token (recommended)
- ID: `dockerhub-credentials`

### Pipeline job
1. Replace `YOUR_DOCKERHUB_USERNAME` in `Jenkinsfile` with your Docker Hub username.
2. Push the changed files to GitHub.
3. Jenkins → **New Item → Pipeline**.
4. Choose **Pipeline script from SCM**, SCM **Git**, provide repository URL and branch `*/main`.
5. Save, then **Build Now** to test.
6. Configure a GitHub webhook to notify Jenkins on pushes, or configure polling.

### Kubernetes deployment from Jenkins
The Jenkins agent must have `kubectl` configured for the intended cluster, and its identity must have permission to update the `expense-tracker` Deployment. Apply `k8s/deployment.yaml` once before the pipeline deploy stage runs. The cluster must be able to pull the Docker Hub image.

The Jenkinsfile uses `sh`, so it expects a Linux/Unix Jenkins agent with Node/npm, Docker and kubectl. If using a Windows-only agent, adapt the shell commands or use a Linux agent.

Important: Minikube on your Windows laptop is not automatically reachable from a remote Jenkins server. For a learning setup, configure Jenkins and Minikube connectivity deliberately, or first run CI + Docker publishing in Jenkins and deploy to Minikube manually. Do not expose the Kubernetes API publicly just to make a demo pipeline work.

## Pipeline stages
1. Checkout from GitHub
2. Install dependencies
3. Validate JavaScript syntax
4. Run automated tests
5. Build Docker image with a unique build number and `latest`
6. Log in to Docker Hub using Jenkins credentials
7. Push both tags
8. Update Kubernetes Deployment and wait for rollout

## Troubleshooting
- `docker: command not found`: install Docker CLI and configure daemon access on the agent.
- `kubectl` connection refused: configure kubeconfig/context for the target cluster.
- `ImagePullBackOff`: check image name/tag, repository visibility or image pull secret.
- Rollout failure: run `kubectl describe pods` and `kubectl logs deployment/expense-tracker`.
- Port 3000 is busy: use `-p 3001:3000`.

## Cleanup
```bash
kubectl delete -f k8s/deployment.yaml
minikube stop
```
