### Begin running local server:
`go run server/main.go`

### If error occurs on attempting to run `tns run android`, do the following:
Remove folders `node_modules`, `platforms` and `hooks`
Run `tns build android`
Run `tns run android --bundle`
