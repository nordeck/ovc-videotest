// Custom config

window.customConfig = {
     "REACT_APP_JITSI_FQDN": "{{- .Values.settings.REACT_APP_JITSI_FQDN -}}",
     "REACT_APP_JWT_ENDPOINT_URL": "{{- .Values.settings.REACT_APP_JWT_ENDPOINT_URL -}}",
     "REACT_APP_ROOM_PREFIX": "{{- .Values.settings.REACT_APP_ROOM_PREFIX -}}",
     "REACT_APP_DEFAULT_CALLBACK_URL":"{{- .Values.settings.REACT_APP_DEFAULT_CALLBACK_URL -}}"
}
