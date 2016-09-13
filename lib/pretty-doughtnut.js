var doughnutWidget = {
	charts: {},

	prettyNumber: function(n) {
		// pretty count
		return (n + '').replace(/./g, function(c, i, a) {
			return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
		});
	},

	positionLabel: function(value) {
		var container = {
			top: $('#' + value).offset().top,
			left: $('#' + value).offset().left,
			height: $('#' + value).height(),
			width: $('#' + value).width()
		}

		var label = {
			height: $('#' + value + 'Label').height(),
			width: $('#' + value + 'Label').width()
		}

		// find position
		var position = {
			top: container.top + container.height / 2 - (label.height / 2),
			left: container.left + container.width / 2 - (label.width / 2)
		}

		$('#' + value + 'Label').offset(position);
	},

	createCanvas: function(value, o) {
		var canvas;
		if (doughnutWidget.options) {
			canvas = $('<canvas>', { id: value, width: doughnutWidget.options.width, height: doughnutWidget.options.height, class: doughnutWidget.options.class});
		} else {
			canvas = $('<canvas>', { id: value, width: o.width, height: o.height});

			if (o.class) {
				canvas.addClass(o.class);
			}
		}

		if (doughnutWidget.options && doughnutWidget.options.container) {
			doughnutWidget.options.container.append(canvas);
		} else {
			o.container.append(canvas);
		}
	},

	render: function(o) {
		for (var i = 0; i < o.length; i++) {
			var value = i;
			if (!doughnutWidget.charts[value + 'Chart']) {
				// create canvas
				doughnutWidget.createCanvas(value, o[i]);

				// create chart
				doughnutWidget.charts[value + 'Chart'] = new Chart($('#' + value).get(0).getContext('2d')).Doughnut(
					[{
						value: o[i].val,
						label: '1',
						color: o[i].color
					}, {
						value: 100 - o[i].val,
						color: '#F0F0F0'
					}],
					{
						percentageInnerCutout: (doughnutWidget.options && doughnutWidget.options.cutout) ? doughnutWidget.options.cutout : 75,
						animationEasing: 'easeOut',
						showTooltips: false
					});

				// click handler
				if (o[i].click) {
					$('#' + value + 'Label .labelLink').click(o[i].click);
				}
			} else {
				// update the charts
				doughnutWidget.charts[value + 'Chart'].segments[0].value = o[i].val;
				doughnutWidget.charts[value + 'Chart'].update();

				var perc = $('#' + value + 'Label .labelLink');
				perc.html(o[i].val + '%');
			}

			doughnutWidget.positionLabel(value);
		}
	}
}