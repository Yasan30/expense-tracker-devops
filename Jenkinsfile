pipeline {
    agent any
    environment {
        // Replace with your Docker Hub repository.
        IMAGE_NAME = 'YOUR_DOCKERHUB_USERNAME/expense-tracker'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }
    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Install Dependencies') {
            steps { sh 'npm install --no-audit --no-fund' }
        }
        stage('Build / Validate') {
            steps {
                sh 'node --check app.js'
                sh 'node --check server.js'
                sh 'node --check public/app.js'
            }
        }
        stage('Test') {
            steps { sh 'npm test' }
        }
        stage('Build Docker Image') {
            steps { sh 'docker build -t $IMAGE_NAME:$IMAGE_TAG -t $IMAGE_NAME:latest .' }
        }
        stage('Push to Docker Hub') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'dockerhub-credentials', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_TOKEN')]) {
                    sh '''
                        set +x
                        echo "$DOCKERHUB_TOKEN" | docker login -u "$DOCKERHUB_USER" --password-stdin
                        docker push "$IMAGE_NAME:$IMAGE_TAG"
                        docker push "$IMAGE_NAME:latest"
                        docker logout
                    '''
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                sh '''
                    kubectl set image deployment/expense-tracker expense-tracker=$IMAGE_NAME:$IMAGE_TAG
                    kubectl rollout status deployment/expense-tracker --timeout=120s
                '''
            }
        }
    }
    post { always { echo 'Expense Tracker pipeline finished. Check stage results.' } }
}
