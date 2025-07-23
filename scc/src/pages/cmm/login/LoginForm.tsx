import React from 'react';
import './index.css';
import {Navigate, useNavigate} from "react-router-dom";
import type { FormProps } from 'antd';
import {Button, Checkbox, Form, Input, Select} from 'antd';
import {useMenuListStore, useMenuStore} from "@pages/bo/base/menu/menuStore.ts";
import {useMenuList} from "@pages/bo/base/menu/useMenu.ts";
import {useLogin, useSaveLoginMgrMutation} from "@pages/cmm/login/useLogin.ts";
import {useMgrList} from "@pages/bo/base/mgr/useMgr.ts";
import {useChatStore} from "@pages/bo/scc/chat/chatStore.ts";
import {useUserStore} from "@pages/bo/base/user/userStore.ts";
import {useUpdateMgrLoginStatusMutation, useUpdateMgrStatusMutation} from "@pages/cmm/cti/useCti.ts";
import type {Login} from "@pages/cmm";

const LoginForm: React.FC = () => {
  const navigate = useNavigate();
  const { setMenuCd } = useMenuStore();
  const { setMenuList } = useMenuListStore();
  const {data: menuList = []} = useMenuList();
  const { mutateAsync: saveLoginMgr } = useSaveLoginMgrMutation();
  const { data: mgrList } = useMgrList();
  const { clearChatSeq } = useChatStore();
  const { setUserId } = useUserStore();
  const { mutate: updateMgrLoginStatus } = useUpdateMgrLoginStatusMutation();
  const {mutate: updateLoginStatus} = useUpdateMgrStatusMutation();

  console.log(menuList);

  const check = localStorage.getItem("check");
  const user = check ? JSON.stringify(check) : null;

  if (user) {
    return <Navigate to="/main" />;
  }

  type FieldType = {
    username?: string;
    password?: string;
    remember?: string;
  };

  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {

    // 로그인 성공
    if (values.username != null) {
      saveLoginMgr(values.username);
      const loginInfo: Login = {
        mgrId : values?.username,
        id: 0,
        deptNm: "",
        mgrNm: "",
        status: "",
        loginTime: ""
      };
      updateLoginStatus({loginInfo, status : "대기"});
      updateMgrLoginStatus({mgrId:values.username, login:"true"});
      clearChatSeq();
      setUserId('');
    }
    localStorage.clear();
    localStorage.setItem("accessToken", crypto.randomUUID() );
    localStorage.setItem("refreshToken", crypto.randomUUID() );
    localStorage.setItem("check", "Y");

    // init menu & menuList set
    setMenuCd('M_MAIN');
    setMenuList(menuList);

    navigate('main');
    console.log('Success:', values);
  };

  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
      <Form
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
      >
        <Form.Item<FieldType>
            label="Username"
            name="username"
            rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Select
              showSearch
              style={{width: 250, textAlign:'center'}}
              placeholder="담당자 선택"
              optionFilterProp="label"
              options={mgrList?.map((mgr) => ({
                label: `${mgr.mgrNm}`,
                value: mgr.id,
                disabled: mgr.status === '휴가',
              }))}
          >
          </Select>
        </Form.Item>

        <Form.Item<FieldType>
            label="Password"
            name="password"
            rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item<FieldType> name="remember" valuePropName="checked" label={null}>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>

        <Form.Item label={null}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
  );
};
export default LoginForm;