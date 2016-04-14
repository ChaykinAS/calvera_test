'use strict';

require.config({
	paths: {
		text: './lib/text',
		json: './lib/json'
	}
});

// Контейнер для списка файлов
// В state.fs передаётся содержимое json-файла
var Tree = React.createClass({
	displayName: 'Tree',


	getInitialState: function getInitialState() {
		return {
			fs: null
		};
	},

	componentDidMount: function componentDidMount() {
		// Загрузка json-файла и обновление списка
		var self = this;
		require(['json!./fs.json'], function (fs) {
			self.setState({
				fs: fs
			});
		});
	},

	render: function render() {
		if (!this.state.fs) {
			// json-файл ещё не загружен
			return React.createElement('div', { className: 'tree-folder m-open m-loading' });
		} else {
			// отрисовка содержимого json-файла
			return React.createElement(
				'div',
				{ className: 'tree-folder m-open' },
				React.createElement(Item, { data: this.state.fs })
			);
		}
	}
});

// Компонент для каждого элемента в списке файлов
// Информация об элементе передаётся в props.data
// От state.expanded зависит показано ли содержание папки
var Item = React.createClass({
	displayName: 'Item',


	getDefaultProps: function getDefaultProps() {
		return {
			data: null
		};
	},

	getInitialState: function getInitialState() {
		return {
			expanded: false
		};
	},

	// разворачивание и сворачивание содержимого папки
	toggleExpand: function toggleExpand(e) {
		e.preventDefault();
		this.setState({
			expanded: !this.state.expanded
		});
	},

	render: function render() {
		var data = this.props.data;
		if (!data) {
			return '';
		} else if (data.type === 0) {
			// папка
			var expanded = this.state.expanded;
			var childrenList = React.createElement(
				'span',
				{ className: 'tree-item_empty-text' },
				'Пустая папка'
			);
			if (data.children.length) {
				childrenList = data.children.map(function (childData, i) {
					return React.createElement(Item, { data: childData, key: i });
				});
			}
			return React.createElement(
				'div',
				{ className: 'tree-item tree-folder' + (expanded ? ' m-open' : '') },
				React.createElement(
					'div',
					{ className: 'tree-item_header', onClick: this.toggleExpand },
					data.name
				),
				React.createElement(
					'div',
					{ className: 'tree-list' + (data.children.length ? '' : ' m-empty') },
					childrenList
				)
			);
		} else if (data.type === 1) {
			// файл
			return React.createElement(
				'div',
				{ className: 'tree-item tree-file' },
				React.createElement(
					'div',
					{ className: 'tree-item_header' },
					data.name
				)
			);
		} else {
			return '';
		}
	}
});

ReactDOM.render(React.createElement(Tree, null), document.getElementById('tree'));

//# sourceMappingURL=script.js.map