require.config({
	paths: {
		text: './lib/text',
		json: './lib/json'
	}
});

// Контейнер для списка файлов
// В state.fs передаётся содержимое json-файла
var Tree = React.createClass({

	getInitialState: function() {
		return {
			fs: null
		};
	},

	componentDidMount: function() {
		// Загрузка json-файла и обновление списка
		var self = this;
		require(['json!./fs.json'], function(fs) {
			self.setState({
				fs: fs
			});
		});
	},

	render: function() {
		if (!this.state.fs) {
			// json-файл ещё не загружен
			return (
				<div className="tree-folder m-open m-loading"></div>
			);
		} else {
			// отрисовка содержимого json-файла
			return (
				<div className="tree-folder m-open">
					<Item data={this.state.fs} />
				</div>
			);
		}
	}
});


// Компонент для каждого элемента в списке файлов
// Информация об элементе передаётся в props.data
// От state.expanded зависит показано ли содержание папки
var Item = React.createClass({

	getDefaultProps: function() {
		return {
			data: null
		};
	},

	getInitialState: function() {
		return {
			expanded: false
		};
	},

	// разворачивание и сворачивание содержимого папки
	toggleExpand: function(e) {
		e.preventDefault();
		this.setState({
			expanded: !this.state.expanded
		});
	},

	render: function() {
		var data = this.props.data;
		if (!data) {
			return '';
		} else if (data.type === 0) {
			// папка
			var expanded = this.state.expanded;
			var childrenList = <span className="tree-item_empty-text">Пустая папка</span>;
			if (data.children.length) {
				childrenList = data.children.map(function (childData, i) {
					return <Item data={childData} key={i}/>;
				});
			}
			return (
				<div className={'tree-item tree-folder' + (expanded? ' m-open' : '')}>
					<div className="tree-item_header" onClick={this.toggleExpand}>
						{data.name}
					</div>
					<div className={'tree-list' + (data.children.length? '' : ' m-empty')}>
						{childrenList}
					</div>
				</div>
			);
		} else if (data.type === 1) {
			// файл
			return (
				<div className="tree-item tree-file">
					<div className="tree-item_header">
						{data.name}
					</div>
				</div>
			);
		} else {
			return '';
		}
	}
});


ReactDOM.render(<Tree />, document.getElementById('tree'));