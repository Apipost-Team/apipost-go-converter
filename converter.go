package converter

import (
	_ "embed"
	"fmt"
	"log"
	"strings"

	"rogchap.com/v8go"
	v8 "rogchap.com/v8go"
)

//go:embed lib.js
var jsCode string

func getV8ctx() (*v8.Context, error) {
	ctx := v8.NewContext()
	var err error //错误信息

	script := `
	var global = this;
	__dirname = '.';
	var module = { exports: {} };
	var exports = module.exports;
	`
	_, err = ctx.RunScript(script, "define_dirname.js")
	if err != nil {
		log.Printf("JS error: %v", err)
		ctx.Close() //主动释放
		return nil, err
	}

	_, err = ctx.RunScript(jsCode, "lib.js") // 执行嵌入的 JavaScript 代码
	if err != nil {
		if jsErr, ok := err.(*v8go.JSError); ok {
			// 打印错误消息
			log.Println("JavaScript Error:", jsErr.Message)
			// 打印发生错误的源文件和行号
			log.Println("Location:", jsErr.Location)
			// 打印详细的堆栈信息
			log.Println("Stack Trace:", jsErr.StackTrace)
		} else {
			log.Printf("Failed to execute JavaScript: %v", err)
		}

		ctx.Close() //主动释放
		return nil, err
	}

	return ctx, nil
}

func Swagger2Apipost(swaggerStr string, isBasePath bool, isHost bool) (string, error) {
	ctx, err := getV8ctx()
	if err != nil {
		return "", err
	}
	defer ctx.Close() //执行完关闭

	callCode := fmt.Sprintf("Swagger2Apipost('%s', %t, %t)", strings.ReplaceAll(swaggerStr, "'", "\\'"), isBasePath, isHost)

	val, err := ctx.RunScript(callCode, "inline.js") // 调用 JavaScript 函数

	if err != nil {
		log.Printf("Failed to run script: %v", err)
		return "", err
	}
	promiseVal, err := val.AsPromise()
	if err != nil {
		log.Printf("Failed to run script: %v", err)
		return "", err
	}

	return promiseVal.Result().String(), nil
}

// 将json字符串转换为jsonschema字符串
func Json2Schema(jsonStr string) (string, error) {
	ctx, err := getV8ctx()
	if err != nil {
		return "", err
	}
	defer ctx.Close() //执行完关闭

	callCode := fmt.Sprintf("Json2Schema('%s')", strings.ReplaceAll(jsonStr, "'", "\\'"))

	val, err := ctx.RunScript(callCode, "inline.js") // 调用 JavaScript 函数
	if err != nil {
		log.Printf("Failed to run script: %v", err)
		return "", err
	}
	log.Println(val)

	return val.String(), nil
}
