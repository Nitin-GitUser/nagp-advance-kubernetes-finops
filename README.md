# NAGP DevOps Assignment

## Overview

This project demonstrates deploying a containerized Node.js application on Kubernetes with support for:

* Namespace isolation
* ConfigMaps and Secrets
* Persistent database deployment
* Ingress-based access
* Kubernetes self-healing
* Rolling deployments
* Horizontal Pod Autoscaling (HPA)
* FinOps best practices for cost optimization

Submission Details
Source Code Repository

GitHub Repository:

https://github.com/Nitin-GitUser/nagp-advance-kubernetes-finops

Docker Image Repository

Docker Hub Image:

https://hub.docker.com/r/goyalnitin/api-service/tags

Service API URL

API Endpoint:

`http://<host-ip>/employees`

Replace <host-ip> with the external IP address or hostname exposed through the Kubernetes Ingress.

This endpoint retrieves employee records stored in the backend database.


---


## Project Structure

| Directory/File       | Description                                                 |
| -------------------- | ----------------------------------------------------------- |
| `app/`               | Node.js application source code and Docker image definition |
| `k8s/namespace.yaml` | Kubernetes namespace manifest                               |
| `k8s/configmap/`     | ConfigMap definitions                                       |
| `k8s/secrets/`       | Secret definitions                                          |
| `k8s/database/`      | Database deployment and storage manifests                   |
| `k8s/api/`           | API deployment, service, and autoscaling manifests          |
| `k8s/ingress/`       | Ingress resources for external access                       |
| `README.md`          | Project documentation                                       |

---

## Application Architecture

The application consists of:

1. **Node.js API**

   * Exposes employee-related endpoints.
   * Connects to the backend database using Kubernetes Secrets and ConfigMaps.

2. **Database**

   * Persistent database deployment with storage backing.
   * Data remains available even after pod recreation.

3. **Ingress**

   * Routes external traffic to the API service.

4. **Horizontal Pod Autoscaler**

   * Scales API pods automatically based on resource utilization.

---

## Deployment Steps

### 1. Deploy Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### 2. Deploy ConfigMap

```bash
kubectl apply -f k8s/configmap/
```

### 3. Deploy Secrets

```bash
kubectl apply -f k8s/secrets/
```

### 4. Deploy Database

```bash
kubectl apply -f k8s/database/
```

### 5. Deploy API

```bash
kubectl apply -f k8s/api/
```

### 6. Deploy Ingress

```bash
kubectl apply -f k8s/ingress/
```

---

## Verification

Verify all resources have been deployed successfully:

```bash
kubectl get all -n nagp-devops
```

Check deployments:

```bash
kubectl get deployments -n nagp-devops
```

Check pods:

```bash
kubectl get pods -n nagp-devops
```

Check services:

```bash
kubectl get svc -n nagp-devops
```

Check ingress:

```bash
kubectl get ingress -n nagp-devops
```

Check HPA:

```bash
kubectl get hpa -n nagp-devops
```

---

## Self-Healing Demo

Insert a test record into the database:

```sql
INSERT INTO employees(name, department, salary)
VALUES ('Persistence Test', 'DevOps', 99999);
```

### Validation

1. Insert the record.
2. Delete the API or database pod manually.

```bash
kubectl delete pod <pod-name> -n nagp-devops
```

3. Kubernetes automatically recreates the pod.
4. Verify that the inserted record still exists.
5. This demonstrates:

   * Pod self-healing
   * Persistent storage retention
   * Kubernetes reconciliation

---

## Rolling Deployment Demo

Update the application image in ```k8s/api/api-deployment.yaml```

```bash
kubectl apply -f k8s/api/api-deployment.yaml -n nagp-devops
```

Monitor rollout progress:

```bash
kubectl rollout status deployment/api -n nagp-devops
```

View rollout history:

```bash
kubectl rollout history deployment/api -n nagp-devops
```

### Expected Result

* New pods are created gradually.
* Existing pods continue serving traffic.
* No downtime during deployment.
* Old pods are terminated only after new pods become healthy.

---

## Scaling with HPA

Generate load using Fortio:

```bash
kubectl run tmp \
  --rm -i \
  --image=fortio/fortio \
  --restart=Never \
  -n nagp-devops \
  --command -- \
  fortio load \
  -qps 500 \
  -t 120s \
  http://api-service.nagp-devops.svc.cluster.local/employees
```

Monitor HPA:

```bash
kubectl get hpa -n nagp-devops -w
```

Monitor pod scaling:

```bash
kubectl get pods -n nagp-devops -w
```

### Expected Result

* Increased CPU utilization.
* HPA scales API pods automatically.
* Additional replicas handle incoming traffic.
* Pods scale back down once traffic decreases.

---

## FinOps Considerations

This implementation follows cloud cost optimization best practices.

### 1. Namespace-Based Cost Isolation

All application resources are deployed into a dedicated namespace:

```text
nagp-devops
```

Benefits:

* Cost attribution
* Ownership tracking
* Resource governance

### 2. Resource Requests and Limits

CPU and memory requests/limits are defined to:

* Prevent resource contention
* Avoid over-allocation
* Improve cluster efficiency

### 3. Horizontal Pod Autoscaling

HPA enables:

* Scaling based on demand
* Reduced idle resource consumption
* Better cost efficiency

### 4. Right-Sized Database

The database deployment avoids unnecessary replicas and excessive resource allocation.

### 5. Cost-Efficient Infrastructure

Infrastructure is designed with:

* Appropriate node sizing
* Efficient workload placement
* Minimal waste

### 6. Metrics-Driven Optimization

Resource allocation is tuned using observed metrics and workload behavior.

### 7. Temporary and Cost-Aware Infrastructure

The environment is intended to:

* Run only when needed
* Minimize idle costs
* Demonstrate efficient cloud resource utilization

---

## Kubernetes Features Demonstrated

* Namespace Isolation
* ConfigMaps
* Secrets Management
* Persistent Storage
* Deployments
* Services
* Ingress
* Self-Healing
* Rolling Updates
* Horizontal Pod Autoscaling (HPA)
* FinOps Best Practices

---

## Cleanup

Remove all resources:

```bash
kubectl delete namespace nagp-devops
```

---

## Author

Nitin Goyal

email: nitin.goyal@nagarro.com




