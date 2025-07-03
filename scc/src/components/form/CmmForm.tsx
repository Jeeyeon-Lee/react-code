import React from 'react';
import { Form } from 'antd';
import type { FormProps } from 'antd';
import smValidateMessages from "@utils/form/smValidateMessages.ts";


const CmmForm = <T extends object>({ children, ...rest }: FormProps<T>) => {
  return (
      <Form {...rest} validateMessages={smValidateMessages}>
        {children}
      </Form>
  );
};

export default CmmForm;
