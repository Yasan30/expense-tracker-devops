
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install --no-audit --no-fund'
            }
        }

        stage('Build / Validate') {
            steps {
                bat 'node --check app.js'
                bat 'node --check server.js'
                bat 'node --check public/app.js'
            }
        }

        stage('Test') {
            steps {
                bat 'npm test'
            }
        }
    }

    post {
        success {
            echo 'Expense Tracker build and tests passed!'
        }
        failure {
            echo 'Build failed. Check the Console Output.'
        }
    }
}
