import MapViewJsx from './MapView.jsx';
import BaseComponent from '../../../../../BaseComponent';
import Libs from '../../../../../../utils/Libs';
import { withTranslation } from 'react-i18next';
import MainProjectService from '../../../../../../services/MainProjectService';

class MapView extends BaseComponent {

    constructor(props, context) {
        super(props, context);
        
        this.state = {
            showInfoWindow: false,
            showIconHover: false,
            dataList: [],
            searchParam: this.props.searchParam
        };

        this.paging = {
            total: 0,
            current: 1,
            currentInput: 1
        };

        this.jsxTemplate = MapViewJsx;

        this.inputChangedHandler = this.inputChangedHandler.bind(this);
        this.inputChangedEnter = this.inputChangedEnter.bind(this);
        this.inputChangedBlue = this.inputChangedBlue.bind(this);

    }

    componentDidMount() {
        this.getList();
    }

    handleMouseOver = (marker, event) => {
        this.setState({
          showInfoWindow: marker
        });
      };
      handleMouseExit = (marker, event) => {
        this.setState({
          showInfoWindow: false
        });
      };
    
      onMouseoverMarker = (marker, event) => {
        this.setState({
          showIconHover: marker
        });
      };
    
      mouseMoveOutOfMarker = (marker, event) => {
        this.setState({
          showIconHover: false
        });
      };

    /**
     * get list
     * @author Long.Pham 2019-06-03
     */
    getList() {
        let self = this;
        let params = this.state.searchParam;
        params.id_language = this.employee.id_language;
        params.id_employee = this.employee.id_employee;
        MainProjectService.instance.getListProjectByEmplpyee(params, (data, total_row) => {

            if (Libs.isArrayData(data)) {
                self.setState({
                    dataList: data
                });

                var total = parseInt(total_row / self.state.searchParam.limit);
                if (total_row % self.state.searchParam.limit > 0) {
                    total = total + 1;
                }
                self.paging.total = total;
                self.paging.current = self.state.searchParam.index;
                self.paging.currentInput = self.state.searchParam.index;
                self.state.total_row = total_row;

            } else {
                self.setState({
                    dataList: [],
                    total_row: 0
                });
                self.paging.total = 0;
                self.paging.current = 1;
                self.paging.currentInput = 1;
            }
            self.forceUpdate();
        });
    }

    inputChangedHandler(event) {
        let self = this;
        let target = event.target;
        let name = target.name;
        let value = target.value;
        if (name === 'current') {
            if (!Libs.isBlank(value)) {
                var { t } = this.props;
                if (!Libs.isNumber(value)) {
                    self.toast(t('common.page_is_number'), "error");
                    return;
                }
            }

            self.paging.currentInput = value;
            self.forceUpdate();
        }

        if (name === 'limit') {
            var { searchParam } = this.state;
            searchParam.limit = value;
            this.setState({
                searchParam: searchParam
            }, () => {
                self.getList();
            })
        }
    }

    inputChangedEnter(event) {
        let self = this;
        if (event.key === 'Enter') {
            var currentInput = this.paging.currentInput;
            if (!Libs.isBlank(currentInput)) {
                var { t } = this.props;
                if (!Libs.isNumber(currentInput)) {
                    self.toast(t('common.page_is_number'), "error");
                    return;
                }
            }

            if (Libs.isBlank(currentInput) && !Libs.isNumber(currentInput)) return;
            if (parseInt(currentInput) > this.paging.total) {
                currentInput = self.paging.total;
            }

            if (currentInput <= 0) {
                currentInput = 1;
            }

            self.paging.current = currentInput;
            self.paging.currentInput = currentInput;
            this.onSelectPage(currentInput);
            self.forceUpdate();
        }
    }

    inputChangedBlue(event) {
        let self = this;
        let target = event.target;
        let name = target.name;
        if (name === 'current') {
            var currentInput = this.paging.currentInput;
            if (!Libs.isBlank(currentInput)) {
                var { t } = this.props;
                if (!Libs.isNumber(currentInput)) {
                    self.toast(t('common.page_is_number'), "error");
                    return;
                }
            }

            if (Libs.isBlank(currentInput) && !Libs.isNumber(currentInput)) return;
            if (parseInt(currentInput) > this.paging.total) {
                currentInput = self.paging.total;
            }

            if (currentInput <= 0) {
                currentInput = 1;
            }

            self.paging.current = currentInput;
            self.paging.currentInput = currentInput;
            this.onSelectPage(currentInput);
            self.forceUpdate();
        }
    }


    /**
     * @description Select page in pagging
     * @author long.pham 09/05/2021
     * @param {int} index
     */
    onSelectPage(index) {
        let self = this;
        self.state.searchParam.index = index;

        if (index > 0) {
            self.state.searchParam.offset = (index - 1) * self.state.searchParam.limit;
        } else {
            self.state.searchParam.offset = 0;
        }
        self.getList();
    }


    /**
     * @description reload data
     * @author long.pham 09/05/2021
     * @param {int} index
     */
    onClickReload() {
        let self = this;
        self.getList();
    }

    render() {
        return this.jsxTemplate.call(this)
    }
}

const HighOrderComponentTranslated = withTranslation('common')(MapView)
export default HighOrderComponentTranslated;