

# Installation of the helm chart

## Prerequisites
- Helm must be installed on your system. Further information on installing Helm can be found [here](https://helm.sh/docs/intro/install/).


## Step 1: Customize configuration
Adjust the values according to your requirements. To do this, use the values.yaml file contained in the chart directory. Open the file and edit the values as required.

Define ingress, ingress is for the frontend.

## Configuration

Refer to `files/config.js` and `values.yaml`  to customize the deployment.


## Install Chart
```console
helm upgrade --install ovc-videotest ./ -f values.yaml
