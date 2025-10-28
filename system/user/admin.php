<?php

/**
 * Vvveb
 *
 * Copyright (C) 2022  Ziadin Givan
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */

namespace Vvveb\System\User;

use function Vvveb\session as sess;
use Vvveb\Sql\AdminSQL;
use Vvveb\System\PageCache;
use Vvveb\System\Session;
use function Vvveb\slugify;
use function Vvveb\rrmdir;
use Vvveb\System\Sites;

class Admin extends Auth {
	private static $namespace = 'admin';

	private static function setUserData(&$data) {
		if (isset($data['password'])) {
			$data['password'] = self :: password($data['password']);
		}

		if (isset($data['site_access'])) {
			if (is_array($data['site_access'])) {
				$data['site_access'] = json_encode($data['site_access']);
			}
		} else {
			$data['site_access'] = '[]';
		}

		return $data;
	}

		public static function add($data) {
		$admin = new AdminSQL();

		//check if email or username is already registered
		$check = ['email'=> $data['email']];

		if ($adminInfo = $admin->get($check)) {
		$condition = ['email'=> $data['email']];
		$result = $adminInfo;
		$newSlug = slugify($data['project_name']);
		
		$destDir     = DIR_THEMES . $newSlug;
		$backupDir     = DIR_THEMES . $newSlug . '/backup';
		$cssDir     = DIR_THEMES . $newSlug . '/css';
		if (file_exists($destDir)) {
    // Delete the destination directory and its contents
        rrmdir($destDir);
}
		// Ensure directory exists
		if (!file_exists($destDir)) {
		mkdir($destDir, 0777, true);
		mkdir($backupDir, 0777, true);
		mkdir($cssDir, 0777, true);
		}

		// Loop through files and save each
		foreach ($data['html'] as $fileName => $content) {
		file_put_contents("{$destDir}/{$fileName}", $content);
		}

		// activate site 
		if (Sites::setTheme(1, $newSlug, 'index.html')) {
			$themeName               = \Vvveb\humanReadable($newSlug);		
		}
		self::setUserData($data);
		return $admin->edit(array_merge([self :: $namespace => $data], $condition));	
		}
		if (! isset($data['username']) || ! $data['username']) {
		
			return false;
		}

		if (isset($data['username'])) {
			$check['username'] = $data['username'];
		}

		$data['status'] = 1; //0

		$newSlug = slugify($data['project_name']);
		
		$destDir     = DIR_THEMES . $newSlug;
		$backupDir     = DIR_THEMES . $newSlug . '/backup';
		$cssDir     = DIR_THEMES . $newSlug . '/css';
		// Ensure directory exists
		if (!file_exists($destDir)) {
		mkdir($destDir, 0777, true);
		mkdir($backupDir, 0777, true);
		mkdir($cssDir, 0777, true);
		}

		// Loop through files and save each
		foreach ($data['html'] as $fileName => $content) {
		file_put_contents("{$destDir}/{$fileName}", $content);
		}

		// activate site 
		if (Sites::setTheme(1, $newSlug, 'index.html')) {
			$themeName               = \Vvveb\humanReadable($newSlug);		
		}
		
        	self::setUserData($data);
		return $admin->add([self :: $namespace => $data]);
	}

	public static function hasCapability($capability, $app = APP) {
		$admin        = sess(self :: $namespace, false);
		$capabilities = $admin['permissions'][$app]['capabilities'] ?? $admin['permissions']['capabilities'] ?? [];

		return in_array($capability, $capabilities);
	}

	public static function siteAccess() {
		$admin       = sess(self :: $namespace, false);

		return $site_access = $admin['site_access'] ?? [];
	}

	public static function hasSiteAccess($site_id) {
		$admin       = sess(self :: $namespace, false);
		$site_access = $admin['site_access'] ?? [];

		return in_array($site_id, $site_access);
	}

	public static function hasPermission($permission, $app = APP) {
		$admin       = sess(self :: $namespace, false);

		if (! $admin) {
			return false;
		}

		$permissions = ($admin['permissions'][$app] ?? $admin['permissions']) ?: [];
		$allow       = $permissions['allow'] ?? [];
		$deny        = $permissions['deny'] ?? [];

		return Role::has($permission, $allow, $deny, $admin['role_id']);
	}

	public static function update($data, $condition) {
		$admin = new AdminSQL();

		self::setUserData($data);

		return $admin->edit(array_merge([self :: $namespace => $data], $condition));
	}

	public static function get($data) {
		$loginInfo = []; //['status' => 1];
		$adminInfo = false;

		if (isset($data['email'])) {
			$loginInfo['email'] = $data['email'];
		}

		if (isset($data['user'])) {
			$loginInfo['username'] = $data['user'];
		}

		if (isset($data['username'])) {
			$loginInfo['username'] = $data['username'];
		}

		if (isset($data['role_id'])) {
			$loginInfo['role_id'] = $data['role_id'];
		}

		if (isset($data['user_id'])) {
			$loginInfo['user_id'] = $data['user_id'];
		}

		if (isset($data['token'])) {
			$loginInfo['token'] = $data['token'];
		}

		if (isset($data['status'])) {
			$loginInfo['status'] = $data['status'];
		}

		if ($loginInfo) {
			$admin     = new AdminSQL();
			$adminInfo = $admin->get($loginInfo);

			if (isset($adminInfo['permissions'])) {
				$adminInfo['permissions'] = json_decode($adminInfo['permissions'], true);
			}

			if (isset($adminInfo['site_access'])) {
				$adminInfo['site_access'] = json_decode($adminInfo['site_access'], true);
			}
		}

		if (! $adminInfo) {
			return [];
		}

		return $adminInfo;
	}

	public static function login($data, $additionalInfo = []) {
		//check admin email and that status is active
		$data['status'] = 1;
		$adminInfo      = self::get($data);

		if (! ($adminInfo && isset($adminInfo['password'])) ||
			! self::checkPassword($data['password'], $adminInfo['password'])) {
			return false;
		}

		$session = Session :: getInstance();
		$session->regenerateId(true);
		unset($adminInfo['password']);
		$session->set(self :: $namespace, $adminInfo + $additionalInfo);

		PageCache::disable('user');

		return $adminInfo;
	}

	public static function logout() {
		PageCache::enable('user');

		return sess([self :: $namespace => false]);
	}

	public static function current() {
		$current = sess(self :: $namespace, []);

		if ($current) {
			PageCache::disable('admin');
		} else {
			PageCache::enable('admin');
		}

		return $current;
	}

	/**
	 * @ Update admin session data
	 * @param mixed $data 
	 *
	 * @return mixed 
	 */
	public static function session($data) {
		$current = self :: current();

		if ($current && $data && is_array($data)) {
			$current = array_merge($current, $data);

			return sess([self :: $namespace => $current]);
		}

		return false;
	}
}
