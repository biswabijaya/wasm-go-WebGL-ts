package main

import (
	"fmt"
	"syscall/js"
)

// CPUIntensiveTask performs a CPU-intensive calculation
func CPUIntensiveTask(this js.Value, args []js.Value) interface{} {
	// Get input value from JavaScript
	n := args[0].Int()
	
	// Perform CPU-intensive calculation (example: factorial)
	result := 1
	for i := 2; i <= n; i++ {
		result *= i
	}
	
	return js.ValueOf(result)
}

func main() {
	fmt.Println("Go WebAssembly Initialized")
	
	// Create a JavaScript global object
	global := js.Global()
	
	// Register Go functions to be callable from JavaScript
	global.Set("computeFactorial", js.FuncOf(CPUIntensiveTask))
	
	// Keep the Go program running
	<-make(chan bool)
}
