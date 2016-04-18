/**
 * @ngdoc service
 * @name accessimapEditeurDerApp.interaction
 * @description
 * Service allowing user to create svg elements
 */
(function() {
    'use strict';

    function interaction(shareSvg) {

        var cellTemplate = '<input\
                            ng-if="row.entity.type === \'boolean\'" \
                            type="checkbox"\
                            value="{{row.entity[col.field]}}"\
                            ng-model="row.entity[col.field]">\
                            <div ng-if="row.entity.type !== \'boolean\'">\
                                {{row.entity[col.field]}}\
                            </div>',

            removeTemplate = '<button\
                                ng-if="row.entity.deletable"\
                                class="btn btn-danger"\
                                ng-click="grid.appScope.$ctrl.removeRow(row.entity)">\
                                <i class="glyphicon glyphicon-remove"></i>\
                                </button>',

            interactiveFiltersInit =
                // TODO : put in settings service ?
                [{
                    id: 'name',
                    f0: 'Aucune interaction',
                    f1: 'Valeur OSM',
                    deletable: false,
                }, {
                    id: 'Guidage',
                    f0: false,
                    f1: true,
                    type: 'boolean',
                    deletable: false,
                }, {
                    id: 'title',
                    f0: 'Titre par défaut',
                    deletable: false,
                }],

            cellClassId = function (grid, row, col, rowRenderIndex) {
                interactiveFiltersInit[rowRenderIndex].id + ' highlight';
            },

            interactiveFiltersColumns = [
                { name: 'id',
                    enableCellEdit: false,
                    enableHiding: false,
                    cellClass: cellClassId,
                },
                { name: 'f0',
                    cellTemplate: cellTemplate,
                    menuItems: [
                        {
                            title: 'Supprimer cette colonne',
                            icon: 'ui-grid-icon-cancel',
                            action: function () {
                                // var colName = this.context.col.name;
                                deleteCol(this.context.col.name);
                            },
                        },
                    ],
                    enableHiding: false, cellClass: cellClassId,
                },
                { name: 'f1',
                    cellTemplate: cellTemplate,
                    menuItems: [
                        {
                            title: 'Supprimer cette colonne',
                            icon: 'ui-grid-icon-cancel',
                            action: function () {
                                // var colName = this.context.col.name;
                                deleteCol(this.context.col.name);
                            },
                        },
                    ],
                    enableHiding: false,
                    cellClass: cellClassId,
                },
                {
                    field: 'remove',
                    displayName: '',
                    width: 40, cellTemplate:
                    removeTemplate,
                    enableCellEdit: false,
                    enableHiding: false,
                    cellClass: cellClassId,
                },
            ],

            nextFilterNumber = 2,

            deleteCol = function (colName) {

                var columnToDelete = 
                        interactiveFiltersColumns.filter(function (col) {
                            return col.name === colName;
                        }),

                    index = interactiveFiltersColumns
                                .indexOf(columnToDelete[0]);

                if (index > -1) {
                    interactiveFiltersColumns.splice(index, 1);
                }

                angular.forEach(interactiveFilters.data, function (row) {
                        delete row[colName];
                    });
            },

            interactiveFilters = {
                data: interactiveFiltersInit,
                showSelectionCheckbox: true,
                enableSorting: false,
                enableRowSelection: true,
                columnDefs: interactiveFiltersColumns,
                onRegisterApi: function (gridApi) {
                    shareSvg.setInteractions(gridApi);
                }
            };

        /**
         * @ngdoc method
         * @name  addFilter
         * @methodOf accessimapEditeurDerApp.interaction
         * @description
         * Add a filter in the columns of the interaction panel
         */
        function addFilter() {
            var filterPosition = interactiveFiltersColumns.length - 1;
            interactiveFiltersColumns.splice(filterPosition, 0, {
                name: 'f' + nextFilterNumber,
                cellTemplate: cellTemplate,
                menuItems: [
                    {
                        title: 'Supprimer cette colonne',
                        icon: 'ui-grid-icon-cancel',
                        action: function () {
                            // var colName = this.context.col.name;
                            deleteCol(this.context.col.name);
                        },
                    },
                ],
                enableHiding: false, cellClass: cellClassId, });
            nextFilterNumber += 1;
        }

        /**
         * @ngdoc method
         * @name  removeRow
         * @methodOf accessimapEditeurDerApp.interaction
         * @description
         * Remove a row in the interactiveFilters data
         * @param  {Object} row [description]
         */
        function removeRow(row) {
            var index = this.interactiveFilters.data.indexOf(row);

            if (index !== -1) {
                this.interactiveFilters.data.splice(index, 1);
            }
        }

        this.interactiveFilters = interactiveFilters;
        this.addFilter          = addFilter;
        this.removeRow          = removeRow;


    }

    angular.module(moduleApp)
        .service('interaction', interaction);
    
    interaction.$inject = ['shareSvg'];

})();