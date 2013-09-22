require.config({
	baseUrl:"/javascripts",
	paths: {
		jquery : "vendor/jquery-1.9.1",
		jqueryUI : "vendor/jquery-ui-1.10.3.custom",
		fileupload : "app/fileupload.jquery"
	},
	shim: {
		jqueryUI : {
			deps : ["jquery"]
		},
		fileupload :{
			deps : ['jquery', 'jqueryUI']
		}
	}

});

require(['./app/app']);

