// strutil_test.go
package converter

import (
	"log"
	"testing"
)

func TestSwagger2Apipost(t *testing.T) {
	buf := `{"openapi":"3.0.0","info":{"title":"简单示例API","description":"这是一个用于演示的简单接口示例","version":"1.0.0"},"paths":{"/hello":{"get":{"summary":"获取Hello World消息","description":"返回一个包含 Hello World 文本的消息","responses":{"200":{"description":"成功","content":{"application/json":{"schema":{"type":"object","properties":{"message":{"type":"string","example":"Hello World"}}}}}}}}}}}`
	result, err := Swagger2Apipost(buf, false, false)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	log.Println(result)
	t.Log("Swagger2Apipost is ok")
}

func TestJson2Schema(t *testing.T) {
	buf := `{"a":1, "b":"b", "c":[]}`

	result, err := Json2Schema(buf)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
	t.Log(result)
	t.Log("Json2Schema is ok")
}

func TestJson2SchemaErorr(t *testing.T) {
	buf := `{"a":a}`

	_, err := Json2Schema(buf)
	if err != nil {
		t.Log("Json2Schema error is ok", err)
	} else {
		t.Errorf("need throw error")
	}
}
