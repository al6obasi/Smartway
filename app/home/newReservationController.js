(function () {
    'use strict';

    angular
        .module('eUI')
        .config(newReservation)

    function newReservation($stateProvider) {
        $stateProvider.state('/reservation/new', {
            url: '/reservation/new',
            controller: 'NewReservationCtrl',
            templateUrl: 'reservation/newReservation/newReservation.html',
            controllerAs: 'vm',
            authenticate: true
        })
    };

    angular
        .module('eUI')
        .controller('NewReservationCtrl', NewReservationCtrl);

    function NewReservationCtrl($cookies, $state, $scope, $rootScope, dataStore, authService, util, dataService, SSRDetailList) {
        var vm = this;

        //console.log ( JSON.stringify(parsePNR) );

        preparePage();

        function preparePage() {

            vm.flights = dataStore.getNewResItinerary();
            vm.newPassengers = dataStore.getNewPassengers();


            vm.SSRs = dataStore.getSSRs();
            vm.OSIs = dataStore.getOSIs();
            vm.REMARKs = dataStore.getREMARKs();

            //  Default data for new passenger
            vm.data = {};
            vm.data.type = 'ADT';
            vm.data.DOB = new Date(new Date().setFullYear(new Date().getFullYear() - 20));
            vm.data.gender = 'M';

            //New flight form default data
            vm.departureDate = defaultNewFlightDepartureDate();

            vm.bookingType = dataStore.getBookingType();
            vm.ticketing = dataStore.getTicketing();

            //SSRs tab
            vm.ssrFormat = '';

            vm.removeSSR = removeSSR;
            vm.addSSR    = addSSR;

            //
            vm.status = '';
            vm.message = '';
            vm.recordLocator = '';

            vm.windowHeight = $(window).height() - 100;

            //New flight dialog
            vm.preDefinedFlights = createFlights();


            vm.itemSelected = itemSelected;

            vm.removePassenger = removePassenger;
            vm.addPassenger    = addPassenger;

            vm.removeOSI = removeOSI;
            vm.addOSI    = addOSI;

            vm.removeREMARK = removeREMARK;
            vm.addREMARK    = addREMARK;

            vm.removeFlight = removeFlight;
            vm.addFlight    = addFlight;

            vm.submit = submit;

            vm.createDate = createDate;
            vm.changePassRef = changePassRef;

            //Itinerary tab
            vm.updateBookingType   = updateBookingType;
            vm.updateTickting = updateTickting;
            vm.updateBookingClass = updateBookingClass;

            //Passenger(s) tab
            vm.updatePassengerType = updatePassengerType;

            //
            vm.updateSSRType = updateSSRType;
            vm.updateOSIs = updateOSIs;
            vm.updateREMARKs = updateREMARKs;

            authService.renderView('/newReservation');

            vm.SSRDetailList = SSRDetailList;
        }

        function itemSelected(flightInfo) {

            $scope.to = flightInfo.to;
            $scope.from = flightInfo.from;
            $scope.flight = flightInfo.airline + ' ' + flightInfo.flightNumber;

            /*
            vm.flight.FROM = vm.preDefinedFlights[itemId].from;
            vm.flight.TO   = vm.preDefinedFlights[itemId].to;
            vm.flight.flightNumber = vm.preDefinedFlights[itemId].carrier + " " + vm.preDefinedFlights[itemId].flightNumber;
            */
        }

        function removePassenger(id) {

            var ssr = '';

            vm.newPassengers.map(function (passenger, idx) {
                if (passenger && passenger.refNumber == id) {
                    ssr = passenger.refNumber;
                    vm.newPassengers.splice(idx, 1);
                }
            });

            vm.SSRs.map(function (value, idx) {
                var num = value.split('-')[1];
                if (num ==  ssr){
                    vm.SSRs.splice(idx, 1);
                }
            });

            vm.SSRs.map(function (value, idx) {
                var num = value.split('-')[1];
                if (num ==  ssr){
                    vm.SSRs.splice(idx, 1);
                }
            });

            vm.newPassengers.map(function (passenger, idx) {
                return passenger.refNumber = (idx+1) +'.1';
            });

            dataStore.setNewPassengers(vm.newPassengers);
        }

        function addPassenger(newPassenger) {

            if ( ! newPassenger || (! newPassenger.firstName) || ( ! newPassenger.lastName || ( ! newPassenger.gender) || ( ! newPassenger.type)) ) {
                return;
            }

            if ( newPassenger.DOB ) {
                newPassenger.DOB = util.changeDateFormat(newPassenger.DOB);
            } else {
                if (vm.data.type == 'ADULT') {
                    newPassenger.DOB = util.getBOD( vm.createDate(-20) );
                } else if (vm.data.type == 'CHILD') {
                    newPassenger.DOB = util.getBOD( vm.createDate(-5) );
                } else if (vm.data.type == 'INFANT') {
                    newPassenger.DOB = util.getBOD( vm.createDate(-1) );
                }
            }

            newPassenger.firstName = newPassenger.firstName.toUpperCase();
            newPassenger.lastName = newPassenger.lastName.toUpperCase();
            newPassenger.refNumber = vm.newPassengers.length + 1 +'.1';

            vm.newPassengers.push(newPassenger);

            dataStore.setNewPassengers(vm.newPassengers);

            //Reset the form data back to default
            vm.data = {};
            vm.data.type = 'ADT';
            vm.data.DOB = new Date(new Date().setFullYear(new Date().getFullYear() - 20));
            vm.data.gender = 'M';

            angular.element('input').first().focus();
        }

        function createDate(years) {
            var date = new Date();
            date.setFullYear(date.getFullYear() + years);
            return date;
        }

        function removeFlight(id) {
            vm.flights.map(function (flight, idx) {
                if(id == idx){
                    vm.flights.splice(idx, 1);
                }
            })
        }

        function removeSSR(index) {
            vm.SSRs.splice(index,1);
        }

        function removeOSI(index) {
            vm.OSIs.splice(index,1);
        }

        function removeREMARK(index) {
            vm.REMARKs.splice(index,1);
        }

        function addFlight(flight, from, to, departureDate) {

            if ( ! flight ) {
                alert( "Flight is required" );
                return;
            }

            if ( ! to  ) {
                alert( "Flight destination city is required" );
                return;
            }

            if ( ! from ) {
                alert( "Flight origion city is required" );
                return;
            }

            var dateStr = util.changeDateFormat(departureDate);

            var newFlight = {
                departureDate : dateStr,
                from          : from.toUpperCase(),
                to            : to.toUpperCase(),
                flightNumber  : flight.split(' ')[1],
                airline       : flight.split(' ')[0],
                bookingClass  : document.getElementById("bookingClass").value
            };

            dataStore.getNewResItinerary().push(newFlight);
            vm.flights = dataStore.getNewResItinerary();

        }

        function submit() {
            if ( ! vm.flights.length ) {
                alert( "Add a flight segment" );
                return;
            }

            if ( ! vm.newPassengers.length ) {
                alert( "Add a passenger" );
                return;
            }

            //NEW PNR JSON Request
            /*
            {
                "type": "REV",
                "passenerList": [{
                    "firstName": "MAHMUD",
                    "lastName": "FATAFTA",
                    "gender": "M",
                    "DOB": "2000-12-25"
                },
                {
                    "firstName": "JAN",
                    "lastName": "JOO",
                    "gender": "F",
                    "DOB": "2003-11-19"
                }],
                "itinerary": [{
                    "departureDate": "21DEC",
                    "bookingClass": "Y",
                    "from": "DFW",
                    "to": "MEX",
                    "flightNumber": flightNumber,
                    "carrier": "AM"
                }]
            }
             */

            // var classType = dataStore.getCabinClass().split('')[0];
            // classType == 'B' ? classType = 'J' : classType = 'Y';
            var passenerList = [];
            var itinerary = [];
            vm.newPassengers.map(function (passenger) {
                passenerList.push({
                    firstName: passenger.firstName,
                    lastName: passenger.lastName,
                    gender: passenger.gender,
                    type: passenger.type,
                    dateOfBirth: passenger.DOB
                })
            });

            vm.flights.map(function (flight) {
                if (flight.departureDate.indexOf(' ') > -1) {
                    flight.departureDate = flight.departureDate.replace(' ', 'T');
                }
                itinerary.push({
                    departureDate: flight.departureDate.split('T')[0],
                    bookingClass : flight.bookingClass,
                    from         : flight.from.toUpperCase(),
                    to           : flight.to.toUpperCase(),
                    flightNumber : flight.flightNumber,
                    carrier      : flight.airline
                })
            });
            // console.log(passenerList);
            var pnrReq = {
                "type"         : vm.bookingType,
                "ticketing"    : vm.ticketing,
                "passenerList" : passenerList,
                "itinerary"    : itinerary,
                "ssrList"      : vm.SSRs,
                "osiList"      : vm.OSIs,
                "remarkList"   : vm.REMARKs
            };

            // alert( JSON.stringify(pnrReq) );
            dataService.createPNR(pnrReq).then(function (results) {
                vm.status = results.data.status;
                vm.message = results.data.errorMessage;
                vm.recordLocator = results.data.recordLocator;

                $("#myModal3").modal({
                    backdrop: "static"
                });

                if (results.data.recordLocator) {
                    cleanUp();
                    var obj = {
                        recordLocator: results.data.recordLocator,
                        details: itinerary,
                        createdDate: new Date().toString().substr(0, 21)
                    };

                    var prevPnr = $cookies.get('PNR');
                    if (prevPnr) {
                        var parsePNR = JSON.parse(prevPnr);
                        parsePNR.pnr.push(obj);
                        $cookies.put('PNR', JSON.stringify(parsePNR));
                    } else {
                        var newPnr = {
                            pnr: []
                        };
                        newPnr.pnr.push(obj);
                        $cookies.put('PNR', JSON.stringify(newPnr));
                    }
                }

            });
            function cleanUp() {
                dataStore.setNewResItinerary([]);
                dataStore.setOSIs([]);
                dataStore.setSSRs([]);
                dataStore.setREMARKs([]);


                vm.flights = dataStore.getNewResItinerary();
                vm.SSRs = dataStore.getSSRs();
                vm.OSIs = dataStore.getOSIs();
                vm.REMARKs = dataStore.getREMARKs();
            }
        }

        function addSSR(text, number) {
            vm.SSRs.unshift( '4' + text + '-' + number );
        }

        function addOSI(osi_text, osi_number) {

            if ( osi_number && osi_number != '' && osi_number != ' ') {

                if (osi_text) {
                    vm.OSIs.unshift('4OSI' + osi_text.toUpperCase() + '-' + osi_number);
                }
            } else {
                if (osi_text) {
                    vm.OSIs.unshift('4OSI' + osi_text.toUpperCase());
                }
            }

            $scope.osi_text = null;
            $scope.osi_number = null;

        }

        function addREMARK(remark_text, remark_number) {

            if ( remark_number && remark_number != '' && remark_number != ' ') {
                if (remark_text) {
                    vm.REMARKs.unshift('5' + remark_text.toUpperCase() + '-' + remark_number);
                }
            } else {
                if (remark_text) {
                    vm.REMARKs.unshift('5' + remark_text.toUpperCase());
                }
            }
            $scope.remark_text = null;
            $scope.remark_number = null;
        }

        function updateBookingType(bookingType) {
            vm.bookingType = bookingType;
            dataStore.setBookingType(bookingType);
        }

        function updateTickting(ticketing) {
            vm.ticketing = ticketing;
            dataStore.setTicketing(ticketing);
        }

        function updateBookingClass (resBookDesigCode, id) {
            vm.flights.forEach(function (flight) {
                if (flight.id == id){
                    flight.bookingClass = resBookDesigCode;
                }
            })
        }

        /***
         * Update the passenger date of birth (DOB) based on the passenger type selection:
         *  ADT = adult
         *  CHD = child
         *  INF = infant
         *
         * @param val
         */
        function updatePassengerType(passengerType) {

            vm.data.type = passengerType;
            if (passengerType == 'ADT') {
                vm.data.DOB = new Date(new Date().setFullYear(new Date().getFullYear() - 20));
            } else if (passengerType == 'CHD') {
                vm.data.DOB = new Date(new Date().setFullYear(new Date().getFullYear() - 5));
            } else if (passengerType == 'INF') {
                vm.data.DOB = new Date(new Date().setFullYear(new Date().getFullYear() - 1));
            }

        };

        function updateSSRType(val, format) {
            $scope.ssr_text = val;
            vm.ssrFormat = format;
        }

        function updateOSIs (osi) {
            $scope.osi_text = osi;
        }

        function updateREMARKs (remark) {
            $scope.remark_text = remark;
        }

        function changePassRef(passengerRefNumber, dataType) {
            if ( dataType === 'OSI') {
                $scope.osi_number = passengerRefNumber;
            } else if ( dataType === 'REMARK') {
                $scope.remark_number = passengerRefNumber;
            } else {
                $scope.ssr_number = passengerRefNumber;
            }
        }

        /***
         * Default date is today's date + 1
         */
        function defaultNewFlightDepartureDate() {
            var defaultDate = new Date();
            defaultDate.setDate( defaultDate.getDate() + 1 );
            return defaultDate;
        }

        function createFlights () {
            var flights = [];

            flights[0] = {
                "id": 0,
                "airline": "AM",
                "flightNumber": "0445",
                "from": "MEX",
                "to": "CUN",
                "departture": "13:15",
                "arrival": "17:33",
                "arrivalDate": 0
            };

            flights[1] = {
                "id": 1,
                "airline": "AM",
                "flightNumber": "0001",
                "from": "MEX",
                "to": "MAD",
                "departture": "18:55",
                "arrival": "12:30",
                "arrivalDate": 1
            }

            return flights;
        }
    }

})();
