import { Collapse, Card, Divider } from 'antd';
import CmmForm from "@components/form/CmmForm.tsx";
const { Panel } = Collapse;
function CmmSearchForm({ children }) {

    return (
        <div>
            <Collapse
                defaultActiveKey={['1']}
            >
                <Panel
                    header="검색"
                    key="1"
                >
                    <CmmForm>
                        {children}
                    </CmmForm>
                </Panel>
            </Collapse>
            <Divider />
        </div>
    );
}

export default CmmSearchForm;