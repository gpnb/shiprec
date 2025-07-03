import React, { useState,useEffect } from 'react';
import '../styles/search.css'
import search from '../icons/Buttons/Search-outlined.png'

function SearchBar({map,isRegistered,darkMode,liveVessels,searchVesselFilters,setSearchVesselFilters,searchPortFilters,setSearchPortFilters,setSearchVesselActive,setSearchPortActive}) {


    const [showFilters, setShowFilters] = useState(false);

    const [searchTerm, setSearchTerm]= useState('');

    // const [searchResults,setSearchResults] = useState([]);

    // const [isListVisible, setIsListVisible] = useState(false);

    // const [num, setNum] = useState(0);

    const [uid, setUid] = useState(null);


    const initialFilters = isRegistered
    ? ['everything', 'ports', 'my_areas', 'vessels', 'my_fleets']
    : ['everything', 'ports', 'vessels'];
  
    useEffect(() => {
        const currentUser = localStorage.getItem('user');
            
        if (currentUser) {
            const parsed_data = JSON.parse(currentUser);
                
            // Session expiration check
            if (parsed_data.expiresAt && Date.now() > parsed_data.expiresAt) {
                localStorage.removeItem('user');
                window.location.href = "/SignIn";
            } else {
                setUid(parsed_data.id);
            }
        }
    
    }, []);

    const [activeFilters, setActiveFilters] = useState(initialFilters);

     useEffect(() => {
        console.log('Active filters updated:', activeFilters);
    }, [activeFilters]);


    // captures the user's input
    const handleTyping = (e) => {
        e.preventDefault();
        setSearchTerm(e.target.value);

    }
    
    const handleNameSearch = async(name) => {
        // change empty spaces in name with %20 for url passing
        name = name.replaceAll(" ", "%20");
        let num = 0; // just a local counter for the number of results found
        setSearchVesselFilters([]);
        setSearchPortFilters([]);

        // get user id 
        try {
            const currentUser = JSON.parse(localStorage.getItem("user"));
            isRegistered = currentUser?.isRegistered === true;
        } catch (err) {
            console.error("Couldn't get user from localStorage : ", err);
        }

        // search fleets by name
        if (activeFilters.includes("my_fleets")) {
            try {
                const response = await fetch(`https://localhost:8080/api/fleets/byname/${uid}/${name}`);
                const result = await response.json();

                if (result.totalElements === 0) {
                    console.log("found nothing from fleets");
                    setSearchVesselFilters([]);
                } else {
                    setSearchVesselFilters([]);
                    setSearchVesselFilters(result.content);
                    setSearchVesselActive(true);
                    num += result.totalElements;
                    console.log(searchVesselFilters);
                }
            } catch(err) {
                console.log("fleet search failed: " + err);
            }
        }

        // search vessels by name
        if (activeFilters.includes("vessels")) {
            // ship HAYDEE has a space at the end of it's name
            // maybe all ships do.
            console.log(name);
            try {
                const response = await fetch(`https://localhost:8080/api/vessels/byname/${name}`);
                const result = await response.json();

                if (result.totalElements === 0) {
                    console.log("found nothing from vessels");
                } else {
                    setSearchVesselFilters(prev => [...prev, ...result.content]);
                    setSearchVesselActive(true);
                    num += result.totalElements;
                    console.log(searchVesselFilters);
                }
            } catch(err) {
                console.log("vessel search failed: " + err);
            }
        }

        // search ports by name
        if (activeFilters.includes("ports")) {
            try {
                const response = await fetch(`https://localhost:8080/api/ports/byname/${name}`);
                const result = await response.json();

                if (result.totalElements === 0) {
                    console.log("found nothing from ports");
                } else {
                    setSearchPortFilters(result.content);
                    setSearchPortActive(true);
                    num += result.totalElements;
                    console.log(searchPortFilters);
                }
            } catch(err) {
                console.log("port search failed: " + err);
            }
        }

        // finding results does not mean items will show (example: found a fleet, and none of it's ships are active on the map)
        console.log("found " + num + " results");
        setSearchPortActive(true);
        setSearchVesselActive(true);
    }

    // search logic goes here
    const handleSearch = (e) => {
        e.preventDefault();

        // reset search
        if (searchTerm === "") {
            setSearchVesselActive(false);
            setSearchPortActive(false);
            return
        }

        // console.log(searchTerm);
        handleNameSearch(searchTerm);
        // alert(`Search filters are is: ${activeFilters}`);
    }


    const toggleSearchFilters = (e) => {
        const id = e.target.id;
        
        // Define filter sets based on isRegistered
        const baseFilters = ['ports', 'vessels'];
        const myFilters = ['my_areas', 'my_fleets'];
        const allFilters = isRegistered ? [...baseFilters, ...myFilters] : baseFilters;
        
        // console.log(liveVessels);

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


    // const handleFilter = (event) => {
    //     setSearchTerm(event.target.value);

    //     if (searchTerm === "") {
    //         setSearchResults([]);
    //         setIsListVisible(false);
    //     } 
    //     else {  // the user can search based on ship name, status,type and imonumber
    //         const newFilter = liveVessels.filter(vessel => 
    //             (vessel.ship_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             vessel.ship_type?.toLowerCase().includes(searchTerm.toLowerCase())) || 
    //             vessel.navigational_status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             vessel.imonumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             false
    //         );
    //         setSearchResults(newFilter);
    //         setIsListVisible(true);
    //     }
    // };


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
                        ? ['my_areas', 'my_fleets', 'ports', 'vessels', 'everything']
                        : ['ports', 'vessels', 'everything']
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