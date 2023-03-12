import Libs from '../utils/Libs';
import CMSHttp from '../utils/CMSHttp';
import Constants from '../utils/Constants';

export default class PrivateGroupService {
    static _instance;
    static get instance() {
        if (!this._instance) {
            this._instance = new PrivateGroupService();
        }
        return this._instance;
    }

    /**
     * @author long.pham 2018-07-27
     * @param  {RoleEntity} objE
     * @param  {function(data,total_row,msg)} callBack
     * @param  {Boolean} isShowProgress
     */
    getList(objE, callBack) {
        try {
            var http = new CMSHttp(true);
            var data = [
                {
                    id: 1,
                    name: "Priavte Group 1",
                    status: 1
                },
                {
                    id: 2,
                    name: "Priavte Group 2",
                    status: 1
                },
                {
                    id: 3,
                    name: "Priavte Group 3",
                    status: 1
                },
                {
                    id: 4,
                    name: "Priavte Group 4",
                    status: 1
                },
                {
                    id: 5,
                    name: "Priavte Group 5",
                    status: 1
                },
                {
                    id: 6,
                    name: "Priavte Group 6",
                    status: 1
                },
            ];
            callBack(data, 40, "");

            // http.post(Constants.URL.GROUP_ATTRIBUTES.LIST, objE, function (status, rs) {
            //     if (typeof callBack === 'function') {
            //         if (!status || !rs) {
            //             //lỗi do http nên không làm gì vì đã có http thư viện xử lý
            //             return;
            //         }
            //         var data = [];
            //         var total_row = 0;
            //         if (rs.status && Array.isArray(rs.data)) {
            //             data = rs.data;
            //             total_row = rs.total_row;
            //         }
            //         callBack(data, total_row, "");
            //     }
            // });
        } catch (error) {
            var msg = error;
            callBack(false, 0, msg);
        }
    }


    /**
      * API call for update Role status
      * @author long.pham
      * @param @param {RoleEntity} objE
      * @param {function(status,msg)} callBack 
      * @param  {boolean} isShowProgress
      */
    updateStatus(objE, callBack) {
        try {
            var http = new CMSHttp(false);
            http.post(Constants.URL.GROUP_ATTRIBUTES.UPDATE_STATUS, objE, function (status, rs) {
                if (typeof callBack === 'function') {
                    if (!status || !rs) {
                        return;
                    }
                    var msg = rs.mess;
                    callBack(rs.status, msg);
                }
            })
        } catch (error) {
            callBack(false, error);
        }
    }




    /**
     * API call for save data
     * @author long.pham 2018-07-27
     * @param {Function} callBack
     * @param {boolean} isShowProgress
     */
    save(objE, callBack) {
        try {
            var http = new CMSHttp(true);
            http.post(Constants.URL.GROUP_ATTRIBUTES.SAVE, objE, function (status, rs) {
                if (typeof callBack === 'function') {
                    if (!status || !rs) {
                        return;
                    }
                    var data = null;
                    var msg = rs.mess;
                    if (!Libs.isObjectEmpty(rs.data)) {
                        data = rs.data;
                    }
                    callBack(rs.status, data, msg);
                }
            })
        } catch (error) {
            callBack(false, null, error);
        }
    }

    /**
      * API call for delete
      * @author long.pham
      * @param @param {RoleEntity} objE
      * @param {function(status,msg)} callBack 
      * @param  {boolean} isShowProgress
      */
    delete(objE, callBack) {
        try {
            var http = new CMSHttp(true);
            http.post(Constants.URL.GROUP_ATTRIBUTES.DELETE, objE, function (status, rs) {
                if (typeof callBack === 'function') {
                    if (!status || !rs) {
                        return;
                    }
                    var data = null;
                    var msg = rs.mess;
                    if (!Libs.isObjectEmpty(rs.data)) {
                        data = rs.data;
                    }
                    callBack(rs.status, data, msg);
                }
            })
        } catch (error) {
            callBack(false, error);
        }
    }


    /**
     * API get detail
     * @author Long.Pham 2019-05-28
     * @param {RegenncyEntity} objE 
     * @param {function(data)} callBack
     * @param {boolean} isShowProgress 
     */

    getDetail(objE, callBack) {
        try {
            var http = new CMSHttp(true);
            http.post(Constants.URL.GROUP_ATTRIBUTES.DETAIL, objE, function (status, rs) {
                if (typeof callBack === 'function') {
                    if (!status || !rs) {
                        //error http => lib http  proccess
                        return;
                    }
                    var data = {};
                    if (rs.status && typeof rs.data === 'object') {
                        data = rs.data;
                    }
                    callBack(data);
                }
            })
        } catch (error) {
            callBack({});
        }
    }



    /**
    * Get dropdown list
    * @author Long.Pham
    * @param {function (data,total_row,msg)} callBack 
    * @param {boolean} isShowProgress 
    */
    getDropdownList(objE, callBack) {
        try {
            var http = new CMSHttp(false);
            var data = [
                {
                    id: 1,
                    value: 1,
                    label: 'Group 1'
                },

                {
                    id: 2,
                    value: 2,
                    label: 'Group 2'
                },
                {
                    id: 3,
                    value: 3,
                    label: 'Group 3'
                },

            ];
            callBack(data, 40, "");
            // http.post(Constants.URL.GROUP_ATTRIBUTES.DROPDOWN_LIST, objE, function (status, rs) {
            //     if (typeof callBack === 'function') {
            //         if (!status || !rs) {
            //             return;
            //         }
            //         var data = [];
            //         var total_row = 0;
            //         if (rs.status && Array.isArray(rs.data)) {
            //             data = rs.data;
            //             total_row = rs.total_row;
            //         }
            //         callBack(data, total_row, "");
            //     }
            // });
        } catch (error) {
            var msg = error;
            callBack(false, 0, msg);
        }
    }



    /**
    * Get dropdown list all attr
    * @author Long.Pham
    * @param {function (data,total_row,msg)} callBack 
    * @param {boolean} isShowProgress 
    */
     getDropdownListAttr(objE, callBack) {
        try {
            var http = new CMSHttp(false);
            http.post(Constants.URL.GROUP_ATTRIBUTES.DROPDOWN_LIST_ATTR, objE, function (status, rs) {
                if (typeof callBack === 'function') {
                    if (!status || !rs) {
                        return;
                    }
                    var data = [];
                    var total_row = 0;
                    if (rs.status && Array.isArray(rs.data)) {
                        data = rs.data;
                        total_row = rs.total_row;
                    }
                    callBack(data, total_row, "");
                }
            });
        } catch (error) {
            var msg = error;
            callBack(false, 0, msg);
        }
    }

}
