package converter

import (
	_ "embed"
	"fmt"
	"log"
	"strings"

	v8 "rogchap.com/v8go"
)

//go:embed lib.js
var jsCode string

func getV8ctx() (*v8.Context, error) {
	ctx := v8.NewContext()

	var err error

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
		log.Printf("Failed to execute JavaScript: %v", err)
		ctx.Close() //主动释放
		return nil, err
	}

	return ctx, nil
}

func Swagger2Apipost(swaggerStr string, basePath bool, host bool) (string, error) {
	return "", nil
}

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

	return val.String(), err
}
