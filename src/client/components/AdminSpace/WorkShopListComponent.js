import React from 'react';
import Input, { InputLabel } from 'material-ui/Input';
import { MenuItem } from 'material-ui/Menu';
import { FormControl } from 'material-ui/Form';
import Select from 'material-ui/Select';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withStyles } from 'material-ui/styles';

const styles = theme => ({
  container: {
     display: 'flex',
     flexWrap: 'wrap',
   },
   formControl: {
     margin: theme.spacing.unit,
     minWidth: 120,
     maxWidth: 300,
   },
});
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

class WorkShopListComponent extends React.Component{
  state = {
    name: [],
  };

  handleWorkshopChange = event => {
    this.props.handleWorkshopChange(event);
    //console.log(event.target.value)
    this.setState({ name: event.target.value });
  };


  render() {
   const { classes } = this.props;

   if(this.props.data.loading==true)
     return(<div className={classes.root}><p>Loading ...</p></div>);

   return (
     <FormControl className={classes.formControl}>
          <Select
            value={this.props.value}
            onChange={this.handleWorkshopChange}
            input={<Input id="name-workshop" />}
          >
           {this.props.data.getListOfWorkshops.map(value => (
              <MenuItem
                key={value.name}
                value={value._id}
              >
                {value.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
     );
   }
}
const workshoplist = gql`
  query getListOfWorkshops {
    getListOfWorkshops {
      _id
      workshopId
      name


    }
  }
`;


const WorkShopListComponentData = graphql(workshoplist)(WorkShopListComponent);
export default withStyles(styles)(WorkShopListComponentData);
