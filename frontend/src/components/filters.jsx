import { useState } from "react";
import '../styles/filters.css'
import filter from '../icons/Buttons/Filters-filled.png'
import cargo from '../icons/ships/cargo.png'
import fishing from '../icons/ships/fishing.png'
import navigation from '../icons/ships/navigation.png'
import other from '../icons/ships/other.png'
import passenger from '../icons/ships/passenger.png'
import pleasure from '../icons/ships/pleasure.png'
import speed from '../icons/ships/speed.png'
import tugs from '../icons/ships/tugs.png'
import tankers from '../icons/ships/tankers.png'


function Filters({map,darkMode,setMapFilters}) {

    const [showFilters,setShowFilters] = useState(false);
    const [activeFilters,setActiveFilters] = useState(['all'])

    const toggleFilters = (e) => {
        const id = e.target.id;

        setActiveFilters(prev => {
            let updated = [...prev];

            if (id === 'all') {
                const isAllActive = prev.includes('all');
                return isAllActive ? [] : ['cargo', 'fishing', 'navigation', 'passenger', 'other', 'pleasure', 'speed', 'tugs', 'tankers', 'all'];
            }

            if (updated.includes(id)) {
                updated = updated.filter(f => f !== id);
            } else {
                updated.push(id);
            }

            const allOptions = ['cargo', 'fishing', 'navigation', 'passenger', 'other', 'pleasure', 'speed', 'tugs', 'tankers'];
            const allSelected = allOptions.every(f => updated.includes(f));

            if (allSelected && !updated.includes('all')) {
                updated.push('all');
            } 
            
            else if (!allSelected) {
                updated = updated.filter(f => f !== 'all');
            }

            return updated;
        });
    };



    return(
        <div className="map_filters">
            <button  className={`${showFilters ? 'active-toggle' : 'inactive-toggle'} ${darkMode ? 'dark-zoom' : ''}`} onClick={() => setShowFilters(!showFilters) } >
                  <img src= {filter} alt='filter toggle' className={` ${darkMode ? 'dark-zoom' : ''}`}/>
            </button>

            {showFilters && (
                <div className="filter-list">
                    <label className="filter">
                        <input type="checkbox" id="all" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("all")}/>
                        <span>Enable/Disable All Types</span>
                    </label>

                    <label className="filter">
                        <input type="checkbox" id="cargo" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("cargo")}/>
                        <img src={cargo} alt="cargo" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span>Cargo Vessels</span>
                    </label>

                    <label className="filter">
                        <input type="checkbox" id="tankers" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("tankers")}/>
                        <img src={tankers} alt="tankers" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span>Tankers</span>
                    </label>
                    
                    <label className="filter">
                        <input type="checkbox" id="passenger" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("passenger")}/>
                        <img src={passenger} alt="passenger" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span>Passenger Vessels</span>
                    </label>
                    
                    <label className="filter">
                        <input type="checkbox" id="tugs" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("tugs")}/>
                        <img src={tugs} alt="tugs" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span>Tugs & Special Crafts</span>
                    </label>

                    <label className="filter">
                        <input type="checkbox" id="speed" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("speed")}/>
                        <img src={speed} alt="speed" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span>High Speed Crafts</span>
                    </label>

                     <label className="filter">
                        <input type="checkbox" id="fishing" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("fishing")} />
                        <img src={fishing} alt="fishing" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span>Fishing Boats</span>
                    </label>

                    <label className="filter">
                        <input type="checkbox" id="pleasure" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("pleasure")}/>
                        <img src={pleasure} alt="pleasure" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span>Pleasure Crafts</span>
                    </label>

                     <label className="filter">
                        <input type="checkbox" id="navigation" className="filter-check" onChange={toggleFilters} checked={activeFilters.includes("navigation")}/>
                        <img src={navigation} alt="navigation" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span>Navigation Aids</span>
                    </label>

                    <label className="filter">
                        <input type="checkbox" id="other" className="filter-check" onChange={toggleFilters}  checked={activeFilters.includes("other")}/>
                        <img src={other} alt="other" className={`filter-icon ${darkMode ? 'dark-filter-icon' : ''}`} />
                        <span> Unspecified Vessels</span>
                    </label>
                </div>
            )}
                        
          
        </div>
    )


}


export default Filters;