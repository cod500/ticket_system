$(document).ready(function () {

    let deleteBtns = document.querySelectorAll('.delete-btn');
    let submitBtns = document.querySelectorAll('.submit-btn');
    let clearBtns = document.querySelectorAll('.clear-btn');
    let clearAll = document.getElementById('clear-all');

    // Loops through .delete-btn class to delete row clicked
    deleteBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {

            if (e.target.id.substring(0, 13) === 'single-ticket') {
                let row = e.target.id.substr(14);
                if (!confirm('Confirm Deletion?')) return false;

                // Send post request to delete specific ticket from row
                $.ajax({
                    type: "DELETE",
                    url: "/delete/" + row,
                    dataType: "json",
                    data: { delete: row },
                    success: function (res) {
                        console.log("Callback done!", res);
                        window.location.href = "/";
                    }
                });

            } else {
                let row = e.target.id.substr(11);
                console.log(e.target.id)
                if (!confirm('Confirm Deletion?')) return false
                document.getElementById(row).remove();

                // Send post request to delete specific ticket from row
                $.ajax({
                    type: "DELETE",
                    url: "/delete/" + row,
                    dataType: "json",
                    data: { delete: row },
                    success: function (res) {
                        console.log("Callback done!", res);
                    }
                });
            }
        });
    });

    //Confirms submit and send data via ajax
    submitBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            let row = e.target.id.substr(11, 5);
            if (!confirm('Confirm Submit?')) return false
            document.getElementById(e.target.id).style.cssText = "background-color: #C0C0C0";
            document.getElementById(e.target.id).innerHTML = 'Closed';

            // Send post request to submit specific ticket in row
            $.ajax({
                type: "PUT",
                url: "/submit/" + row,
                dataType: "json",
                data: { status: row },
                success: function (res, status) {
                    console.log("Callback done!");
                }
            });
        });
    });

    // Clears each clicked notification in modal by lopping through buttons
    // Loops through .delete-btn class to delete row clicked
    clearBtns.forEach(function (btn) {
        btn.addEventListener('click', function (e) {
            let row = e.target.id.substr(10);
            console.log(row)

            document.getElementById(`notification-${row}`).remove();

            // Send delete request to delete specific ticket from row
            $.ajax({
                type: "DELETE",
                url: "/delete/notification/" + row,
                dataType: "json",
                data: { delete: row },
                success: function (res) {
                    console.log("Callback done!", res);
                }
            });

        });
    });

    //Clear all notifications and delete from databate
    clearAll.addEventListener('click', function (e) {
        clearBtns.forEach(function (btn) {
            let row = btn.id.substr(10);
            console.log(row)
            document.getElementById(`notification-${row}`).remove()
        });
        this.remove();

        // Send delete request to delete all notifications
        $.ajax({
            type: "DELETE",
            url: "/notifications/delete",
            success: function (res) {
                console.log("Callback done!", res);
            }
        });
    });


    // let toggleChart = document.querySelector('.show-chart-btn');
    let chart = document.querySelector('.chart-container');
    let rows = document.querySelector('.ticket-table');

    $('.show-chart-btn').click(function () {
        $('.chart-container').toggleClass('toggle-chart');
        $('tbody tr:nth-last-child(-n+4)').toggle();
        $('.show-chart-container p').html() == "Show Proficiency Chart" ? $('.show-chart-container p').html('Hide Chart') :
            $('.show-chart-container p').html("Show Proficiency Chart");
    });




    //Hide full table in mobiel view
    // let toggleTable = function () {
    //     let windowWidth = document.body.clientWidth;

    //     if (windowWidth < 1050) {

    //         $("td:not(:nth-child(3)").hide();

    //         $('.expand-btn').click(function () {
    //             $(this).closest('tr').toggleClass('.collapsed');

    //             console.log(this)

    //             if ($(this).closest('tr').hasClass('.collapsed')) {
    //                 $(this).closest('tr').children().slice(1).show();
    //             } else {
    //                 $(this).closest('tr').children().slice(1).hide()
    //             }
    //         });
    //     } else {
    //         $("td:not(:nth-child(1)").show();
    //     }

    // };

    // $(window).resize(function () {
    //     toggleTable();
    // });
    //Fire it when the page first loads:
    // toggleTable();


    // Show and Hide top menu on resize 
    $(window).on('resize', function () {
        var win = $(this); //this = window
        if (win.height() > 900) {
            $('.nav-top').css('display', 'flex');
        }

        if (win.width() < 900) {
            $('.nav-top').hide();
        }

    });

    //Hide and show mobile menu on click
    $('.dropdown-icon').click(() => {
        if ($('.nav-top').css('display') == 'none') {
            $('.nav-top').css('display', 'flex');
        } else {
            $('.nav-top').css('display', 'none');
        }
    });






















});

