
import BaseComponent from '../../../../BaseComponent';
import Libs from '../../../../../utils/Libs';
import Constants from '../../../../../utils/Constants';
import AddPopupJsx from './AddPopup.jsx';
import AddPopupValidate from './AddPopupValidate';
import ProjectGroupService from '../../../../../services/ProjectGroupService';
import ProjectService from '../../../../../services/ProjectService';
import EmployeeService from '../../../../../services/EmployeeService';

class AddPopup extends BaseComponent {
    constructor(props) {
        super(props);
        this.state = {
            curItem: Object.assign({}, this.props.curItem),
            allLanguage: this.props.allLanguage,
            dataProjectGroup: [],
            dataListEmployee: []
        }

        this.jsxTemplate = AddPopupJsx;
        this.handleDropdownChange = this.handleDropdownChange.bind(this);
    }
    /**
     * @description Called immediately after the component is mounted in the DOM. Called after the render function
     * @author Long.Pham 12/05/2021
     */
    componentDidMount() {
        var { curItem } = this.state;
        if (curItem.screen_mode === Constants.SCREEN_MODE.ADD) {
            var dataEmployees = [];
            dataEmployees.push({ id_project: null, id_employee: this.employee.id_employee });
            curItem.dataEmployees = dataEmployees;

        }
        this.getDataProjectGroup();
        this.getListAllEmployee();
    }

    onIsCheckedChange = (index) => {
        var { dataListEmployee } = this.state;
        if (!Libs.isArrayData(dataListEmployee)) return;
        var item = dataListEmployee[index];
        if (Libs.isObjectEmpty(item)) return;
        dataListEmployee[index].is_checked = dataListEmployee[index].is_checked ? 0 : 1;
        this.setState({
            dataListEmployee: dataListEmployee
        })
    }
    /**
     * ge list employee
     * @author Long.Pham 2019-06-03
     */
    getListAllEmployee() {
        let self = this;
        var params = {
            id_language: this.employee.id_language
        };

        var { curItem } = this.state;
        
        var dataEmployees = Libs.isArrayData(curItem.dataEmployees) ? curItem.dataEmployees : [];
        EmployeeService.instance.getListAll(params, (data, total_row) => {
            if (Libs.isArrayData(data)) {
                for (var i = 0, len = data.length; i < len; i++) {
                    var findItem = Libs.find(dataEmployees, 'id_employee', data[i].id);
                    if (!Libs.isObjectEmpty(findItem)) {
                        data[i].is_checked = 1;
                    } else {
                        data[i].is_checked = 0;
                    }
                }
                self.setState({
                    dataListEmployee: data
                });
            } else {
                self.setState({
                    dataListEmployee: []
                });
            }
        })
    }

    /**
     * @description Upload icon  
     * @author Long.Pham 12/05/2021
     */
    onFileAvatarChange = (event) => {
        var { t } = this.props;
        var target = event.target;
        var file = target.files[0];
        if (!file || file === undefined || file === null) return;
        var fileName = file.name, fileSize = file.size;
        var checkExtFile = Libs.checkExtensionFile(fileName, 1);
        var msgAvatarError = null;
        if (!checkExtFile) {
            msgAvatarError = t('message.msg_err_ext_image_file')
        }
        else if (fileSize <= 0) {
            msgAvatarError = t('message.msg_err_file_size');
        }
        else if (fileSize > Constants.COMMON.MAX_IMAGE_SIZE) {
            msgAvatarError = t('message.msg_err_max_size_upload');
        }

        var self = this;
        var { curItem } = this.state;
        if (!Libs.isBlank(msgAvatarError)) {
            curItem.upload_thumbnail = '';
            curItem.thumbnail_message = msgAvatarError;
            this.setState({
                curItem: curItem
            });

            return;
        } else {
            curItem.thumbnail_message = '';
            this.setState({
                curItem: curItem
            });
        }

        //Read file upload
        var reader = new FileReader();
        reader.onload = function (e) {
            curItem.upload_thumbnail = e.target.result;
            curItem.upload_thumbnail_name = fileName;
            self.setState({
                curItem: curItem
            });
        };
        reader.readAsDataURL(file);
    }


    /**
     * @description Delete icon upload 
     * @author Long.Pham 12/05/2021
     */
    onClickDeleteAvatar = (event) => {
        var { curItem } = this.state;
        curItem.thumbnail_message = '';
        curItem.thumbnail_upload = '';
        curItem.thumbnail = null;

        this.setState({
            curItem: curItem
        });
    }



    /**
     * ge list roles
     * @author Long.Pham 2019-06-03
     */
    getDataProjectGroup() {
        let self = this;
        var params = {
            id_language: this.employee.id_language
        };

        ProjectGroupService.instance.getDropdownList(params, (data, total_row) => {
            if (Libs.isArrayData(data)) {
                self.setState({
                    dataProjectGroup: data
                });
            } else {
                self.setState({
                    dataProjectGroup: []
                });
            }
        })
    }

    handleDropdownChange = (item, name) => {
        var self = this;
        let curItem = self.state.curItem;

        if (Libs.isObjectEmpty(item)) {
            curItem.id_project_group = '';
        } else {
            var value = item.value;
            curItem[name] = value;
            self.setValidateMessage({ id_project_group: '' }, true);
        }

        self.setState({
            curItem: curItem
        });
    }

    onClickShowTab = (e, tabActive) => {
        var curItem = this.state.curItem;
        if (Libs.isBlank(tabActive)) return;
        curItem.tabActive = tabActive;

        this.setState({
            curItem: curItem
        });
    }


    /**
     * @description validate a field input
     * @author Long.Pham 12/05/2021
     * @param {*} event 
     */
    async validateOne(event) {
        let target = event.target;
        let name = target.name;
        let value = target.value
        if (name) {
            let param = {
                [name]: value
            }
            let v = new AddPopupValidate(this.props);
            let error = await v.validateOne(param, name);
            if (error != null) {
                this.setValidateMessage(error, true);
            }
        }
    }

    /**
     * @description select change
     * @author Long.Pham 12/05/2021
     * @param {*} event 
     */

    handleInputTranslateChange = (event) => {
        var target = event.target;
        var name = target.name;
        var value = target.value;
        if (target.type === 'checkbox') {
            value = target.checked ? 1 : 0;
        }
        if (name) {
            let item = this.state.curItem;
            let allLanguage = this.state.allLanguage;
            let isoCode = name.substr(-2, 2),
                dataName = name.substr(0, 4),
                dataSiteName = name.substr(0,9),
                dataDescription = name.substr(0, 11);

            allLanguage.map((language, index) => {
                if (isoCode === language.iso_code && dataName === 'name') {
                    item.data[index].name = (event.target.validity.valid) ? value : this.state.curItem.data[index].name;
                }

                if (isoCode === language.iso_code && dataSiteName === 'site_name') {
                    item.data[index].site_name = (event.target.validity.valid) ? value : this.state.curItem.data[index].site_name;
                }

                if (isoCode === language.iso_code && dataDescription === 'description') {
                    item.data[index].description = (event.target.validity.valid) ? value : this.state.curItem.data[index].description;
                }
                return 1;
            });

            item[name] = (event.target.validity.valid) ? value : this.state.curItem[name];

            this.setState({ curItem: item });
        }
    }



    /**
     * @description save data
     * @author long.pham 12/05/2021
     */
    async onSave() {
        var {curItem, dataListEmployee} = this.state, self = this;
        var params = Object.assign({}, this.state.curItem);
        var screenMode = (!Libs.isBlank(curItem.id)) ? Constants.SCREEN_MODE.EDIT : ((!Libs.isBlank(this.props.curItem.screen_mode)) ? this.props.curItem.screen_mode : Constants.SCREEN_MODE.ADD);
        let v = new AddPopupValidate(this.props);
        let errors = await v.FLValidationAll(curItem);
        if (errors) {
            this.setValidateMessage(errors);
            return;
        }
        //remove message validation
        this.removeAllValidateMessage();
        params.screen_mode = screenMode;

        params.iso_code_lang = this.employee.lang;
        params.id_language = this.employee.id_language;
        params.iso_code = this.employee.iso_code;

        var dataEmployees = [];
        if(Libs.isArrayData(dataListEmployee)){
            for(var i = 0, len = dataListEmployee.length; i < len; i++){
                if(dataListEmployee[i].is_checked){
                    dataEmployees.push({
                        id_project: null,
                        id_employee: dataListEmployee[i].id
                    })
                }
            }
        }
        params.dataEmployees = dataEmployees;

        if (Libs.isArrayData(params.data)) {
            let itemLanguageDefault = Libs.find(params.data, 'is_default', 1);
            if (!itemLanguageDefault) return;

            params.data.map((item, index) => {
                params.data[index].name = (item.name === '') ? itemLanguageDefault.name : item.name;
                params.data[index].site_name = (item.site_name === '') ? itemLanguageDefault.site_name : item.site_name;
                params.data[index].description = (item.description === '') ? itemLanguageDefault.description : item.description;
                return params;

            });
        } else { return false; }

        ProjectService.instance.save(params, function (status, data, msg) {
            if (status) {
                self.toast(msg, "info");
                self.props.onClickCloseAdd(true);
            }
            else if (data) {
                self.setValidateMessage(data);
            }

            else if (!Libs.isBlank(msg)) {
                self.toast(msg, "error");
            }
        }, true);
    }
}
export default AddPopup;