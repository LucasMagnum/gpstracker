package main

import (
    "fmt"
    "net/http"
)

func main(){
    outputDir := http.Dir("platforms/android/build/outputs/apk")

    fmt.Println("Serving files on 8002")
    http.ListenAndServe(":8002", http.FileServer(outputDir))
}
