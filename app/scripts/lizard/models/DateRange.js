Lizard.Models.DateRange = Backbone.Model.extend({
    accountModel: null,
    initialize: function (options) {
        if (options.accountModel) {
            this.accountModel = options.accountModel;
            this.readInitialPeriod(this.accountModel);
            this.accountModel.on('change:initialPeriod', this.readInitialPeriod, this);
        }
    },
    teardown: function () {
        if (this.accountModel) {
            this.accountModel.off('change:initialPeriod', this.readInitialPeriod, this);
        }
    },
    readInitialPeriod: function (accountModel) {
        var initialPeriod = accountModel.get('initialPeriod');
        var max = moment();
        var min = null;
        switch (initialPeriod) {
            case '24h':
                min = moment(max).subtract('hours', 24);
                break;
            case '48h':
                min = moment(max).subtract('hours', 48);
                break;
            case '1w':
                min = moment(max).subtract('weeks', 1);
                break;
            case '1m':
                min = moment(max).subtract('months', 1);
                break;
            case '1y':
                min = moment(max).subtract('years', 1);
                break;
            default:
                // take extent from data
                max = null;
                min = null;
        }
        if (min && max) {
            this.set({
                start: min.toDate(),
                end: max.toDate()
            });
        }
    },
    defaults: {
        start: null,
        end: null
    }
});
