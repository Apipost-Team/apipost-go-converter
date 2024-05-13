// strutil_test.go
package converter

import "testing"

func TestSwagger2Apipost(t *testing.T) {
	buf := "test"

	_, err := Swagger2Apipost(buf, false, false)
	if err != nil {
		t.Errorf("Error: %v", err)
	}
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
