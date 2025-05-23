import { useState } from "react";
import filters from '../icons/filters.png'
import open_filters from '../icons/open-filters.png'
import '../styles/filters.css'

function Filters({map,setMapFilters}) {

    const [showFilters,setShowFilters] = useState(false);


    return(
        <div className="map_filters">
            {showFilters && <button className="filter-toggle" onClick={ () => setShowFilters(false)}><img src={filters} alt = 'filter-toggle'/></button>}
            {!showFilters && <button className="filter-toggle" onClick={ () => setShowFilters(true)}><img src={open_filters} alt = 'filter-toggle'/></button>}
            {showFilters &&
                <div className="filter_display">
                        

                </div>    
            
            }
        </div>
    )


}


export default Filters;