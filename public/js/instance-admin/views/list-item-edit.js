define(
  [
    'jquery',
    'underscore',
    'Backbone',
    'backbone-forms',
    'underscore',
    'instance-admin/views/submit-form-helper',
    'jqueryui/autocomplete'
  ],
  function (
    $,
    _,
    Backbone,
    BackboneForms,
    _,
    submitFormHelper
  ) {

    var ListItemEditView = Backbone.View.extend({
  
      initialize: function () {
      
        this.model.on( 'change', this.render, this );
      
        this.form = new BackboneForms({
          model: this.model,
        });
        
      },
      
      render: function () {
        var model_schema = this.model.schema;
      
        // render the form and add save button
        var $form    = $( this.form.render().el );
        $form
          .find('ul')
            .append('<input type="submit" name="save" value="Save" />')
            .append('<button name="delete">Delete</button>');
      
        // add an autocomplete to those fields that want one
        var ac_field_names = _.filter(
          _.keys(model_schema),
          function(field_name) {
            return model_schema[field_name].autocomplete_source;
          }
        );

        _.each( ac_field_names, function ( field_name ) {
          
          var ac_source = model_schema[field_name].autocomplete_source;
          
          $form
            .find('input[name="' + field_name + '"]')
            .autocomplete({
              source: ac_source
            });
          
        });
      
        // update our element
        this.$el.html( $form );
      
        return this;
      },

      events: {
        'submit form ':                'submitForm',
        'click button[name:"delete"]': 'deleteEntry',
      },
      
      deleteEntry: function (event) {
        event.preventDefault();
        this.model.destroy();
        this.remove();
      },
      
      submitForm: function (event) {
        var view = this;
        
        var success_cb = function ( model, response ) {

          var template_args = {
            item: model.toJSON(),
            api_url_root: model.urlRoot,
          };
          
          view.$el.html( view.template( template_args ) );
        };

        var submitter = submitFormHelper({
          success_cb: success_cb,
          view: view
        });
        
        submitter(event);
      },
      
    });
  
    return ListItemEditView;
  
  }
);