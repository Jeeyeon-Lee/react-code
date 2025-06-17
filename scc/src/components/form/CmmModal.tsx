import { Modal } from 'antd';
import type { ModalProps } from 'antd';

interface CmmModalProps extends ModalProps {}

const CmmModal = ({ children, ...restProps }: CmmModalProps) => {
    return (
        <Modal
            centered
            destroyOnClose
            maskClosable={false}
            {...restProps}
        >
            {children}
        </Modal>
    );
};

export default CmmModal;