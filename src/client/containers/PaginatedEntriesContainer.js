import React from "react";
import ReactDOM from "react-dom"
import {connect} from 'react-redux'
import { CircularProgress } from 'material-ui/Progress';
import Divider from 'material-ui/Divider'
import {List as MaterialList,ListItem} from 'material-ui/List'
import { graphql } from 'react-apollo'
import gql from "graphql-tag"
import ActivityHistory from '../components/AdminSpace/ActivityHistory';



// import {List} from "immutable"

const mapStateToProps = (state = {}) => {
    // console.dir(state)
    return {...state};
};

let headStyle = {
    fontFamily: "'Roboto', sans-serif",
    color: '#00BCD4',
	textAlign:"center",
}

let progressStyle = {
	paddingLeft:"45%",
	paddingTop:"10%"
}

/******************************************************************************************************************
 *  GraphQL  Query to be executed
 ******************************************************************************************************************/
const MyQuery = gql`query MainQuery($first:Int!,$after:String){
						mainQuery(first:$first,after:$after) {
							totalCount
							edges {
								cursor
								node {
									entryId
				          dateEntry
                  action
                  agent {
                    id
                    username
                  }
                  user{
                    id
                    username
                    profile{
                      name
                      forname
                      avatar
                    }
                  }
								}
							}
							pageInfo{
								endCursor
								hasNextPage
							}
						}
					}`

/******************************************************************************************************************
 *  GraphQL  Query to be executed
 ******************************************************************************************************************/
const configObject = {
	options: (props) => {
		let after = props.endCursor || "";
		return {
			variables: { first: 200, after: after },
		}
	} ,
	force:true,
	props:({ownProps,data})=>{
		// console.log("DATAA ===> ")
		const  { loading, mainQuery,  fetchMore } = data
/******************************************************************************************************************
 *  This callback function is called to load more rows from GraphQL Server.
 ******************************************************************************************************************/

      const loadMoreRows = ()=>{
          return fetchMore({
            variables:{
              after:mainQuery.pageInfo.endCursor,
            },
            updateQuery:(previousResult,{fetchMoreResult})=> {
              const totalCount=fetchMoreResult.data.mainQuery.totalCount
              const newEdges=fetchMoreResult.data.mainQuery.edges
              const pageInfo=fetchMoreResult.data.mainQuery.pageInfo

              return {
                // By returning `cursor` here, we update the `loadMore` function
                // to the new cursor.
                mainQuery:{
                  totalCount,
                  edges:[...previousResult.mainQuery.edges, ...newEdges],
                  pageInfo
                }
              };
            }
          })
        }

/******************************************************************************************************************
 *  props to be passed to subsequent children.
 ******************************************************************************************************************/
		return {
			loading,
			mainQuery,
			loadMoreRows
		}
	}
}


/******************************************************************************************************************
 *  PaginationContainer
 ******************************************************************************************************************/

export  class PaginationContainer extends React.Component{
   render(){
       const {dispatch,loading,mainQuery,loadMoreRows} = this.props

	   let renderChild;
	   if (loading){
			renderChild = <CircularProgress size={80} thickness={7} style={progressStyle} />
	   }
	   else if(mainQuery) {
			renderChild= <ActivityHistory loadMoreRows={loadMoreRows} mainQuery={mainQuery}/>
		}

	   return (
		   <div>
			   {renderChild}
		   </div>
	   )
	}
}

 const PaginationContainerWithData = graphql(MyQuery,configObject)(PaginationContainer)
export default  connect(mapStateToProps)(PaginationContainerWithData)
