pipeline {
    agent any
    stages {
        stage('Build') { 
            steps {
                nodejs(nodeJSInstallationName: 'nodejs') {
                    sh 'npm run build'
                }
            }
        }
        stage('Deliver') {
            steps {
                script {
                    try {
                        sh 'docker stop frontend_ca'
                    }
                    catch (err) {
                        echo "Warning: no such container frontend_ca"
                    }
                    try {
                        sh 'docker rm codeanalysis'
                    }
                    catch (err) {
                        echo "Warning: no such container codeanalysis"
                    }
                    try {
                        sh 'docker rmi codeanalysis'
                    }
                    catch (err) {
                        echo "Warning: no such image codeanalysis"
                    }
                }
                sh 'docker build -t frontend_ca .'
                sh 'docker run -d -p 8081:80 --name frontend_ca frontend_ca'
                sh 'echo "Deliver success"'
            }
        }
    }
}
