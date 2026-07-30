pipeline {
    agent any
    
    environment {
        IMAGE_REPO = 'romyrichu/ecommerce-backend'
        IMAGE_TAG = "${BUILD_NUMBER}"
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm ci'
            }
        }

        stage('Test') {
            steps {
                sh 'npm test || true'
            }
        }

        stage('SonarQube Analysis') {
    	    steps {
        	script {
            	    def scannerHome = tool 'SonarScanner'

            	    withCredentials([string(credentialsId: 'sonarqube-token', variable: 'SONAR_TOKEN')]) {
                	sh """
                	${scannerHome}/bin/sonar-scanner \
                  	-Dsonar.host.url=http://sonarqube:9000 \
                  	-Dsonar.token=$SONAR_TOKEN \
                  	-Dsonar.projectKey=ecommerce-backend \
                  	-Dsonar.projectName=ecommerce-backend \
                  	-Dsonar.sources=. \
                  	-Dsonar.projectVersion=${BUILD_NUMBER}
                	"""
            	    }
        	}
    	    }
	}

	stage('Quality Gate') {
    	    steps {
                timeout(time: 5, unit: 'MINUTES') {
            	    waitForQualityGate abortPipeline: true
        	}
    	    }
	}

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE_REPO}:${IMAGE_TAG} .'
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([
                    usernamePassword(
                        credentialsId: 'dockerhub-credentials',
                        usernameVariable: 'DOCKER_USERNAME',
                        passwordVariable: 'DOCKER_TOKEN'
                    )
                ]) {
                    sh '''
                        echo "$DOCKER_TOKEN" | docker login \
                          -u "$DOCKER_USERNAME" \
                          --password-stdin

                        docker push "${IMAGE_REPO}:${IMAGE_TAG}"
                    '''
                }
            }
        }
    }

    post {
        always {
            sh 'docker logout || true'
            echo 'Pipeline finished.'
        }

        success {
            echo "Published image: ${IMAGE_REPO}:${IMAGE_TAG}"
        }

        failure {
            echo 'Pipeline failed. Inspect the failed stage.'
        }
    }
}
