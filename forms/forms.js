(function ($) {

    "use strict";

    var $document = $(document),
        $window = $(window),
        contactForm = $('#contactForm'); // सिर्फ contactForm के लिए

    $document.ready(function () {

        // Datepicker initialization
        if ($('.datetimepicker').length) {
            $('.datetimepicker').datetimepicker({
                format: 'DD/MM/YYYY',
                ignoreReadonly: true,
                icons: {
                    time: 'icon icon-clock',
                    date: 'icon icon-calendar2',
                    up: 'icon icon-top',
                    down: 'icon icon-bottom',
                    previous: 'icon icon-left',
                    next: 'icon icon-right',
                    today: 'icon icon-tick',
                    clear: 'icon icon-close',
                    close: 'icon icon-close'
                }
            });
        }

        // Timepicker initialization
        if ($('.timepicker').length) {
            $('.timepicker').datetimepicker({
                format: 'LT',
                ignoreReadonly: true,
                icons: {
                    time: 'icon icon-clock',
                    up: 'icon icon-top',
                    down: 'icon icon-bottom',
                    previous: 'icon icon-left',
                    next: 'icon icon-right'
                }
            });
        }

        // Validate and submit the contact form
        if (contactForm.length) {
            contactForm.validate({
                rules: {
                    name: {
                        required: true,
                        minlength: 2
                    },
                    message: {
                        required: true,
                        minlength: 20
                    },
                    email: {
                        required: true,
                        email: true
                    }
                },
                messages: {
                    name: {
                        required: "Please enter your name",
                        minlength: "Your name must consist of at least 2 characters"
                    },
                    message: {
                        required: "Please enter message",
                        minlength: "Your message must consist of at least 20 characters"
                    },
                    email: {
                        required: "Please enter your email"
                    }
                },
               submitHandler: function submitHandler(form) {
    $(form).ajaxSubmit({
        type: "POST",
        data: $(form).serialize(),
        url: "form/process-contact.php",
        success: function success(response) {
            if (response === 'success') {
                $('.successform', $contactform).fadeIn();
                $contactform.get(0).reset();
            } else {
                $('.errorform', $contactform).fadeIn();
            }
        },
        error: function error() {
            $('.errorform', $contactform).fadeIn();
        }
    });
}

            });
        }
    });

})(jQuery);
