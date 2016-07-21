import { Tab, Tabs } from 'react-bootstrap';
import QueryLog from './QueryLog'
import React from 'react';

const SouthPane = React.createClass({
  tableChanged: function (data) {
    console.log(data);
  },
  render: function () {
    var data = [];
    var selectRowProp = {
      mode: "checkbox",
      clickToSelect: false,
    };
    var cellEditProp = {
      mode: "click",
      blurToSave: true,
      //afterSaveCell: onAfterSaveCell
    }
    return (
      <Tabs>
        <Tab title="Query Log" eventKey={1}>
          <QueryLog/>
        </Tab>
        <Tab title="Templating" eventKey={2}>
          <BootstrapTable
              data={data}
              onChange={this.tableChanged}
              insertRow={true}
              deleteRow={true}
              selectRow={selectRowProp}
              cellEdit={cellEditProp}>
            <TableHeaderColumn dataField="variable" editable={true} isKey={true}>Variable</TableHeaderColumn>
            <TableHeaderColumn dataField="value" editable={true}>Value</TableHeaderColumn>
          </BootstrapTable>
        </Tab>
      </Tabs>
    );
  }
});

export default SouthPane
