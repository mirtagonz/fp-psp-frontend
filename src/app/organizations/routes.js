import OrganizationsView from './index/layout-view';
import HubView from './index/hubs/layout-view';
import OrganizationView from './show/view';
import NewOrganizationView from './add/view';
import hubStorage from './index/hubs/storage';
import OrganizationDashboard from './dashboard/model';
import Model from './model';

const organizations = props => {
  const { app } = props;
  const routes = {
    appRoutes: {
      'collaborators(/:entity)': 'showHubs',
      'collaborators(/:entity)/:id': 'showOrganizations2',
      'organizations(/)': 'showOrganizations',
      'organizations/new': 'newOrganization',
      'organizations/:id(/:entity)': 'showOrganization'
    },
    controller: {
      // paginated organizations
      showHubs(entity) {
        hubStorage.find().then(model => {
          app.showViewOnRoute(new HubView({ model, app, entity }));
        });
      },
      showOrganizations() {
        // organizationsStorage.find().then(model => {
        //   app.showViewOnRoute(new OrganizationsView({ model, app }));
        // });
        const model = new Model();
        let params = {};
        params.applicationId = app.getSession().get('user').application.id;
        if(app.getSession().get('user').organization !== null){
          params.organizationId = app.getSession().get('user').organization.id
        }

        model
          .fetch({
            data: params
          })
          .then(() => {
            app.showViewOnRoute(
              new OrganizationsView({
                model,
                app,
              })
            );
          });

      },
      showOrganizations2(entity, applicationId) {
        const model = new Model();
        let params = {};
        params.applicationId = applicationId;
        model
          .fetch({
            data: params
          })
          .then(() => {
            app.showViewOnRoute(
              new OrganizationsView({
                model,
                app,
              })
            );
          });

      },
      showOrganization(organizationId, entity) {
        // show the organization dashboard
        const model = new OrganizationDashboard();
        model
          .fetch({
            data: {
              organizationId
            }
          })
          .then(() => {
            app.showViewOnRoute(
              new OrganizationView({
                model,
                app,
                entity,
                organizationId
              })
            );
          });
      },
      newOrganization() {
        app.showViewOnRoute(new NewOrganizationView());
      }
    }
  };
  return routes;
};

export default organizations;
