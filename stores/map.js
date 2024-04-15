import { defineStore } from 'pinia'
import { ref } from "vue"
import 'leaflet/dist/leaflet.css'
import * as L from "leaflet"
import * as EsriLeafletVector from "esri-leaflet-vector"
import * as EsriLeafletGeocoder from "esri-leaflet-geocoder"
import { createToast } from "mosha-vue-toastify"
import 'mosha-vue-toastify/dist/style.css'

export const useMapStore = defineStore('map', () => {
    // Variables and constants
    const zoom = 15
    const mapContainer = ref()
    const locationInput = ref(null)
    const locationsDropdown = ref(null)
    const apiKey = import.meta.env.VITE_MAP_API_KEY
    let mapObject = {}
    let latlng = [51.505, -0.09]
    let marker = null
    const locationSuggestions = ref([])
    // -----------------------


    // Auxiliary functions

    function reverseGeocode() {
        return EsriLeafletGeocoder
            .reverseGeocode({
                apikey: apiKey
            })
            .latlng(latlng)
    }
    
    function geocode(text) {
        return EsriLeafletGeocoder
            .geocodeService({
                apikey: apiKey
            })
            .geocode()
            .text(text)
    }

    function suggestAddresses(text) {
        return EsriLeafletGeocoder
            .geocodeService({
                apikey: apiKey
            })
            .suggest().text(text)
    }
    
    function handleResults (func, resultCallback, args = [], errorCallback = Function()) {
        func(...args).run((error, result) => {
            if (error) {
                console.error(error)
                if (errorCallback) {
                    errorCallback(error)
                }
            } else {
                resultCallback(result)
            }
        })
    }

    function setMarker (fill = true) {
        if (marker) {
            marker.remove()
        }

        marker = L.marker(latlng, {draggable: true, autoPan: true})
            .addTo(mapObject)
            .on("dragend", (event) => {
                latlng = event.target._latlng
                bindMarkerPopup()
                if (fill) fillLocationField()
            })
    }

    function showPopup (txt) {
        marker.bindPopup(txt);
        marker.openPopup();
    }

    function bindMarkerPopup (popupText) {
        if (popupText) {
            showPopup(popupText)
        } else {
            handleResults(reverseGeocode, (result) => {
                showPopup(result.address.Match_addr)
            })
        }
    }

    function fillLocationField () {
        handleResults(reverseGeocode, (result) => {
            locationInput.value.value = result.address.LongLabel + ", " + result.address.CntryName
        })
    }

    function showLocationsDropdown () {
        if (!locationsDropdown.value.classList.contains("active")) {
            locationsDropdown.value.classList.add("active")
        }
    }

    function hideLocationsDropdown () {
        if (locationsDropdown.value.classList.contains("active")) {
            locationsDropdown.value.classList.remove("active")
        }
    }

    function findLocation (text) {
        handleResults(geocode, (result) => {
            if (result.results.length > 0) {
                locationInput.value.value = result.results[0].properties.LongLabel
                latlng = result.results[0].latlng
                mapObject.setView(latlng, zoom)
                setMarker()
                bindMarkerPopup(result.results[0].text)
            } else {
                createToast('Location not found. Try another search string.', {
                    type: 'danger',
                    position: 'top-center',
                })
            }
        }, [text])
    }

    /* This is a function for solving the problem of
    the marker not showing in a production environment */
    function setDefaultMarkerIcon() {
        let iconUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png"
        let iconRetinaUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png"
        let shadowUrl = "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png"

        const iconDefault = L.icon({
            iconRetinaUrl,
            iconUrl,
            shadowUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            tooltipAnchor: [16, -28],
            shadowSize: [41, 41]
        });

        L.Marker.prototype.options.icon = iconDefault;
    }

    function addEventListeners () {
        mapObject.on("click", (event) => {
            latlng = event.latlng
            setMarker()
            bindMarkerPopup()
            fillLocationField()
        })

        locationInput.value.addEventListener('focus', showLocationsDropdown);
        locationInput.value.addEventListener('blur', hideLocationsDropdown);
    }

    // ----------------------------------------


    // Main functions (which will be exported)

    function init() {
        mapObject = L.map(mapContainer.value)

        mapObject.setView(latlng, zoom)

        EsriLeafletVector.vectorBasemapLayer('arcgis/navigation', {
            apiKey: apiKey
        }).addTo(mapObject)

        if (import.meta.env.PROD) {
            setDefaultMarkerIcon()
        }
        setMarker()
        bindMarkerPopup()
        fillLocationField()

        addEventListeners()
    }

    function getLocation() {
        navigator.geolocation.getCurrentPosition((position) => {
            latlng = [
                position.coords.latitude,
                position.coords.longitude
            ]

            mapObject.setView(latlng, zoom)

            setMarker()
            bindMarkerPopup()
            fillLocationField()
        })
    }

    function fillLocationDropdown(event) {
        handleResults(suggestAddresses, (result) => {
            if(!result.suggestions || result.suggestions.length == 0) {
                hideLocationsDropdown()
            } else {
                showLocationsDropdown()
                locationSuggestions.value = result.suggestions
            }
        }, [event.target.value], (error) => {
            hideLocationsDropdown()
            setTimeout(() => {
                locationSuggestions.value = []
            }, 1500)
        })
    }

    function chooseSuggestion(event) {
        findLocation(event.target.innerText)
    }

    function searchForLocation(event) {
        hideLocationsDropdown()
        findLocation(event.target.value)
    }

    // -------------------


    // Exporting the needed properties and functions

    return {
        mapContainer,
        locationInput,
        locationsDropdown,
        locationSuggestions,
        init,
        getLocation,
        fillLocationDropdown,
        chooseSuggestion,
        searchForLocation
    }
})