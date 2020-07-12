import React, { useState, useEffect } from "react";
import {
  Form,
  Row,
  Col,
  Card,
  Select,
  DatePicker,
  Input,
  Radio,
  Button,
  Popconfirm,
  notification,
} from "antd";
import API from "../../../service/_api";
import { busqueda as busquedaProfesiones } from "../../../service/profesiones";
import { busqueda as busquedaReligiones } from "../../../service/religiones";
import {
  detalle as detallePaciente,
  crear as crearPaciente,
  actualizar as actualizarPaciente,
} from "../../../service/pacientes";
import moment from "moment";
import { useHistory } from "react-router-dom";

const { Option } = Select;

const requiredFieldRule = {
  required: true,
  message: "Este campo es requerido",
};

const formItemColLayout = {
  md: {
    span: 12,
  },
};

const formItemLayout = {
  span: 24,
};

const TabDatos = ({ idPaciente }) => {
  const history = useHistory();

  const [departamentos, setDepartamentos] = useState(null);
  const [profesiones, setProfesiones] = useState(null);
  const [religiones, setRelgiones] = useState(null);
  const [provincias, setProvincias] = useState(null);
  const [distritos, setDistritos] = useState(null);
  const [paciente, setPaciente] = useState(null);

  const onFinish = (values) => {
    if (idPaciente) {
      actualizarPaciente(idPaciente, values).then(({ data }) => {
        notification.success({ message: "Paciente actualizado" });
      });
    } else {
      crearPaciente(values).then(({ data }) => {
        notification.success({ message: "Paciente creado" });
        history.push(`/pacientes/${data.id}`);
      });
    }
  };

  React.useEffect(() => {
    Promise.all([
      API.get("/departamentos/busqueda", { params: { query: "" } }).then(
        (res) => {
          setDepartamentos(res.data);
        }
      ),
      API.get("/provincias/busqueda", {
        params: { query: "", idDepartamento: 1 },
      }).then((res) => {
        setProvincias(res.data);
      }),
      API.get("/distritos/busqueda", {
        params: { query: "", idProvincia: 1 },
      }).then((res) => {
        setDistritos(res.data);
      }),
      busquedaProfesiones("").then((response) => {
        setProfesiones(response.data);
      }),
      busquedaReligiones("").then((response) => {
        setRelgiones(response.data);
      }),
    ]).then(() => {
      if (idPaciente) {
        detallePaciente(idPaciente).then((res) => {
          res.data.fechaNacimiento = moment(res.data.fechaNacimiento);
          setPaciente(res.data);
        });
      }
    });
  }, [idPaciente]);

  const handleDepartamentoChange = (value) => {
    API.get("/provincias/busqueda", {
      params: { query: "", idDepartamento: value },
    }).then((res) => {
      setProvincias(res.data);
    });
  };

  const handleProvinciaChange = (value) => {
    API.get("/distritos/busqueda", {
      params: { query: "", idProvincia: value },
    }).then((res) => {
      setDistritos(res.data);
    });
  };

  const formReady =
    (!idPaciente || (idPaciente && paciente)) &&
    departamentos &&
    provincias &&
    distritos;

  return formReady ? (
    <Form onFinish={onFinish} initialValues={paciente}>
      <Row>
        <Col span={24}>
          <Card
            bordered={false}
            loading={!departamentos || !formReady}
            title="Datos generales"
          >
            <Row gutter={24}>
              <Col {...formItemColLayout}>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item
                      label="Tipo documento"
                      name="tipoDocumento"
                      rules={[requiredFieldRule]}
                    >
                      <Select placeholder="Seleccione tipo de documento">
                        <Option value="D">DNI</Option>
                        <Option value="E">Carné de extranjeria</Option>
                        <Option value="C">Cédula de identidad</Option>
                        <Option value="P">Pasaporte</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item
                      label="Número documento"
                      name="numeroDocumento"
                      rules={[requiredFieldRule]}
                    >
                      <Input />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item
                      label="Apellidos"
                      style={{ marginBottom: 0, width: "100%" }}
                    >
                      <Form.Item
                        name="apellidoPaterno"
                        rules={[requiredFieldRule]}
                        style={{
                          display: "inline-block",
                          width: "calc(50% - 8px)",
                          margin: "0 8px 0 0",
                        }}
                      >
                        <Input placeholder="Paterno" />
                      </Form.Item>
                      <Form.Item
                        name="apellidoMaterno"
                        rules={[requiredFieldRule]}
                        style={{
                          display: "inline-block",
                          width: "calc(50%)",
                        }}
                      >
                        <Input placeholder="Materno" />
                      </Form.Item>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item
                      label="Nombres"
                      style={{ marginBottom: 0, width: "100%" }}
                    >
                      <Form.Item
                        name="primerNombre"
                        rules={[requiredFieldRule]}
                        style={{
                          display: "inline-block",
                          width: "calc(50% - 8px)",
                          margin: "0 8px 0 0",
                        }}
                      >
                        <Input placeholder="Primer nombre" />
                      </Form.Item>
                      <Form.Item
                        name="segundoNombre"
                        rules={[requiredFieldRule]}
                        style={{
                          display: "inline-block",
                          width: "calc(50%)",
                        }}
                      >
                        <Input placeholder="Segundo nombre" />
                      </Form.Item>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item name="genero" label="Genero">
                      <Radio.Group>
                        <Radio value="M">Masculino</Radio>
                        <Radio value="F">Femenino</Radio>
                      </Radio.Group>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Email" name="email">
                      <Input placeholder="correo@gmail.com" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Telefono fijo" name="telefonoFijo">
                      <Input placeholder="7353234" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col {...formItemColLayout}>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item
                      label="Fecha de nacimiento"
                      name="fechaNacimiento"
                    >
                      <DatePicker style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Departamento" name="idDepartamento">
                      <Select
                        placeholder="Seleccione departamento"
                        onChange={handleDepartamentoChange}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {departamentos
                          ? departamentos.map((i) => (
                              <Option key={i.id} value={i.id}>
                                {i.value}
                              </Option>
                            ))
                          : null}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Provincia" name="idProvincia">
                      <Select
                        placeholder="Seleccione provincia"
                        onChange={handleProvinciaChange}
                        disabled={!provincias}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {!provincias
                          ? null
                          : provincias.map((i) => (
                              <Option key={i.id} value={i.id}>
                                {i.value}
                              </Option>
                            ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Distrito" name="idDistrito">
                      <Select
                        placeholder="Seleccione distrito"
                        disabled={!distritos}
                        filterOption={(input, option) =>
                          option.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                        showSearch
                      >
                        {!distritos
                          ? null
                          : distritos.map((i) => (
                              <Option key={i.id} value={i.id}>
                                {i.value}
                              </Option>
                            ))}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Direccion" name="direccion">
                      <Input placeholder="Av. Emancipacion N 109" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Celular" name="celular">
                      <Input placeholder="736291804" />
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Celular contacto" name="celularContacto">
                      <Input placeholder="736291804" />
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card
            bordered={false}
            title="Otros datos"
            loading={!profesiones || !religiones || !formReady}
          >
            <Row gutter={24}>
              <Col {...formItemColLayout}>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Ocupación" name="idProfesion">
                      <Select placeholder="Seleccione ocupación" allowClear>
                        {profesiones
                          ? profesiones.map((item) => (
                              <Option value={item.value}> {item.label}</Option>
                            ))
                          : null}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Estado Civil" name="estadoCivil">
                      <Select placeholder="Seleccione estado civil">
                        <Option value="S">Soltero (a)</Option>
                        <Option value="C">Casado (a)</Option>
                        <Option value="V">Viudo (a)</Option>
                        <Option value="D">Divorciado (a) </Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
              <Col {...formItemColLayout}>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Religión" name="idReligion">
                      <Select placeholder="Seleccione religión" allowClear>
                        {religiones
                          ? religiones.map((item) => (
                              <Option value={item.value}> {item.label}</Option>
                            ))
                          : null}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
                <Row>
                  <Col {...formItemLayout}>
                    <Form.Item label="Referido por" name="estadoCivil">
                      <Select placeholder="Seleccione ocupacion">
                        <Option value="1">Departamento 1</Option>
                        <Option value="2">Departamento 2</Option>
                        <Option value="3">Departamento 3</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
      <Row justify="end" gutter={12}>
        <Col>
          {!idPaciente ? <Popconfirm
            placement="topLeft"
            title="Seguro que desea cancelar el registro?"
            onConfirm={() => history.push("/pacientes")}
            okText="Sí, seguro"
            cancelText="No"
          >
            <Button type="link"> Cancelar</Button>
          </Popconfirm> : null}
        </Col>
        <Col>
          <Button type="primary" htmlType="submit">
            {idPaciente ? "Actualizar" : "Guardar"}
          </Button>
        </Col>
      </Row>
    </Form>
  ) : (
    <React.Fragment>
      <Row>
        <Col span={24}>
          <Card loading bordered={false} title="Datos generalees"></Card>
        </Col>
      </Row>
      <Row>
        <Col span={24}>
          <Card loading bordered={false} title="Otros datos"></Card>
        </Col>
      </Row>
    </React.Fragment>
  );
};

export default TabDatos;
