import React from 'react';
import { Form } from 'antd';
import type { FormProps } from 'antd';
import smValidateMessages from "@utils/form/smValidateMessages.ts";


/**
 * antd Form 태그 내 validate customize 추가
 */

const CmmForm = <T extends object>(props: FormProps<T>) => {
  return <Form {...props} validateMessages={smValidateMessages} />;
};

export default CmmForm;
