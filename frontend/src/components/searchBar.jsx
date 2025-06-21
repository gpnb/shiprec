import React, { useState,useEffect,useRef } from 'react';
import '../styles/search.css'
import search from '../icons/Buttons/Search-outlined.png'

function SearchBar({map,isRegistered,darkMode,liveVessels}) {


    const [showFilters, setShowFilters] = useState(false);

    const [searchTerm, setSearchTerm]= useState('');

    const [searchResults,setSearchResults] = useState([]);


    const [isListVisible, setIsListVisible] = useState(false);


    const initialFilters = isRegistered
    ? ['everything', 'ports', 'my_areas', 'vessels', 'companies', 'my_fleets']
    : ['everything', 'ports', 'vessels', 'companies'];
  
    const [activeFilters, setActiveFilters] = useState(initialFilters);

     useEffect(() => {
        console.log('Active filters updated:', activeFilters);
    }, [activeFilters]);


    // captures the user's input
    const handleTyping = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);

    }

    // search logic goes here
    const handleSearch = (e) => {
        e.preventDefault();
        alert(`Search term is: ${searchTerm}`);
        alert(`Search filters are is: ${activeFilters}`);
    }


    const toggleSearchFilters = (e) => {
        const id = e.target.id;
        
        // Define filter sets based on isRegistered
        const baseFilters = ['ports', 'vessels', 'companies'];
        const myFilters = ['my_areas', 'my_fleets'];
        const allFilters = isRegistered ? [...baseFilters, ...myFilters] : baseFilters;
        
        setActiveFilters(prev => {
            if (id === 'everything') {
            // Toggle "everything"
            return prev.includes('everything') ? [] : [...allFilters, 'everything'];
            }
        
            // Remove "everything" if any other filter clicked
            let updated = prev.filter(f => f !== 'everything');
        
            // If filter is already selected, remove it
            if (updated.includes(id)) {
            updated = updated.filter(f => f !== id);
            } 
            // Else add it (only if it is in allowed filters)
            else if (allFilters.includes(id)) {
            updated.push(id);
            }
        
            // If all filters (allowed) are selected, add "everything"
            const allSelected = allFilters.every(f => updated.includes(f));
            if (allSelected && !updated.includes('everything')) {
            updated.push('everything');
            }
        
            return updated;
        });
    };
    

    // "ship_name":"F/V LE NATIF 2 ","ship_type":"Fishing","imonumber":0,"navigational_status":" not defined = default (also used by AIS-SART under test)","course_over_ground":184.5,"speed_over_ground":7.3,"rate_of_turn":-127.0,"latitude":48.029633,"longitude":-4.7729535,"eta":39222000,"heading":511.0,"draught":0.0,"destination":"ST GILLE + DE UIE "}


    const handleFilter = (event) => {
        setSearchTerm(event.target.value);

        if (searchTerm === "") {
            setSearchResults([]);
            setIsListVisible(false);
        } 
        else {  // the user can search based on ship name, status,type and imonumber
            const newFilter = liveVessels.filter(vessel => 
                (vessel.ship_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vessel.ship_type?.toLowerCase().includes(searchTerm.toLowerCase())) || 
                vessel.navigational_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                vessel.imonumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                false
            );
            setSearchResults(newFilter);
            setIsListVisible(true);
        }
    };


    return(
        <div className="search">

            <div className='search-bar'>

                <form style={{ display: 'flex', flexDirection:'row', width:'90%'}} onSubmit={handleSearch}>
                    <button type='submit' className='search_button'  onSubmit={() => handleSearch()}>
                        <img src = {search} alt='search' className={`${darkMode ? 'dark-zoom' : ''}`}/>
                    </button>
                    <input className='search_prompt' type='text' placeholder='Search...' onChange={handleTyping}/> 
                </form>

               
              
                { isRegistered &&  <p className='toggle-search-filters' onClick={() => setShowFilters(!showFilters) }> ... </p>}
            </div>   
            
            
            {(showFilters  && isRegistered) && 
                <div className='search-filters'>
                    {(isRegistered 
                        ? ['companies', 'my_areas', 'my_fleets', 'ports', 'vessels', 'everything']
                        : ['companies', 'ports', 'vessels', 'everything']
                    ).map(id => (
                        <button
                        key={id}
                        id={id}
                        onClick={toggleSearchFilters}
                        className={activeFilters.includes(id) ? 'active' : ''}
                        >
                        {id.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        </button>
                    ))}
                </div>
            }


            
                {/* {isListVisible && searchTerm !== "" && searchResults.length > 0 &&  (
                       <ul className='dataResult'>
                    {searchResults.slice(0, 15).map((value) => {
                        
    
                        return (
                            <li key={value.id} className="dataItem">
                                <p>
                                <img src={value.profilePicture?`data:image/jpeg;base64,${value.profilePicture}`:placeholder } alt = 'profile'className='picture'/>
                                    {value.firstName} {value.lastName}
                                    <a href={`/VisitProfile/${value.id}`}> Visit Profile </a>
                                        
                                    
                                </p>
                            </li>
                        );
                       
                    })}
                    </ul>
                )   
                
                
                } */}
            

  

        

        </div>
    )
}

export default SearchBar;